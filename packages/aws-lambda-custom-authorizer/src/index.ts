import { ILogger, nullLogger } from "@yingyeothon/logger";
import {
  AuthResponseContext,
  CustomAuthorizerHandler,
  CustomAuthorizerResult
} from "aws-lambda";

const http401Error = "Unauthorized";

const splitByDelimiter = (data: string, delim: string) => {
  const pos = data.indexOf(delim);
  return pos > 0 ? [data.substr(0, pos), data.substr(pos + 1)] : ["", ""];
};

export interface IBasicCredential {
  id: string;
  password: string;
}

interface IBasicAuthorization {
  type: "Basic";
  credential: IBasicCredential;
}

interface IBearerAuthorization {
  type: "Bearer";
  token: string;
}

interface IUnknownAuthorization {
  type: "Unknown";
  scheme: string;
  credential: string;
}

export type Authorization =
  | IBasicAuthorization
  | IBearerAuthorization
  | IUnknownAuthorization;

const parseAuthorization = (token: string): Authorization => {
  const [type, credential] = splitByDelimiter(token, " ");
  if (type === "Basic") {
    const decoded = Buffer.from(credential, "base64")
      .toString("utf8")
      .trim();
    const [id, password] = splitByDelimiter(decoded, ":");
    return { type, credential: { id, password } };
  } else if (type === "Bearer") {
    return { type, token: credential };
  }
  return { type: "Unknown", scheme: type, credential };
};

export interface IAuthorized {
  allow: boolean;
  context?: AuthResponseContext;
}

type Authorizer = (authorization: Authorization) => Promise<IAuthorized>;

interface IHandlerArguments {
  authorize: Authorizer;
  onError?: (error: Error) => void;
  logger?: ILogger;
}

const defaultErrorHandler = (logger: ILogger) => (error: Error) => {
  logger.error(error);
  throw new Error(http401Error);
};

const buildAuthorizer = ({
  authorize,
  onError: maybeOnError,
  logger = nullLogger
}: IHandlerArguments): CustomAuthorizerHandler => async event => {
  let authorized: IAuthorized = {
    allow: false
  };
  // Step 1. Authorize.
  try {
    logger.debug(
      `authorization
    Token`,
      event.authorizationToken
    );
    if (event.authorizationToken === undefined) {
      throw new Error(`No authorizationToken`);
    }
    
    const authorization = parseAuthorization(event.authorizationToken);
    logger.debug(`authorization`, authorization);

    authorized = await authorize(authorization);
    logger.debug(`authorized`, authorized);
  } catch (error) {
    const onError = maybeOnError || defaultErrorHandler(logger);
    onError(error);
  }

  // Step 2. Build a policy to allow or deny.
  const policy: CustomAuthorizerResult = {
    principalId: "user",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: authorized.allow ? "Allow" : "Deny",
          Resource: event.methodArn
        }
      ]
    },
    context: authorized.context
  };
  logger.debug(`policy`, policy);
  return policy;
};

export default buildAuthorizer;
