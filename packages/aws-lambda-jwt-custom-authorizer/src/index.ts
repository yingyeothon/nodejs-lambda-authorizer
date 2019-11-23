import buildAuthorizer, {
  IBasicCredential
} from "@yingyeothon/aws-lambda-custom-authorizer";
import { ILogger, nullLogger } from "@yingyeothon/logger";
import { CustomAuthorizerHandler } from "aws-lambda";
import * as jwt from "jsonwebtoken";

interface IJWTAuthorizerArguments {
  jwtSecret: string;
  jwtExpiresIn?: string | number;
  buildJWTPayload?: <P extends string | object | Buffer>(
    credential: IBasicCredential
  ) => P;
  login: (credential: IBasicCredential) => Promise<boolean>;
  logger?: ILogger;
}

type JWTAuthorizer = (
  parameters: IJWTAuthorizerArguments
) => CustomAuthorizerHandler;

const buildJWTAuthorizer: JWTAuthorizer = ({
  jwtSecret,
  jwtExpiresIn = "30m",
  buildJWTPayload = ({ id }) => ({ id } as any),
  login,
  logger = nullLogger
}: IJWTAuthorizerArguments): CustomAuthorizerHandler =>
  buildAuthorizer({
    authorize: async auth => {
      // Basic authentication
      if (auth.type === "Basic") {
        logger.debug(`BasicAuth`, auth.credential.id);
        if (!(await login(auth.credential))) {
          logger.debug(`BasicAuth`, `Failed`, auth.credential.id);
          return { allow: false };
        }
        const token = jwt.sign(buildJWTPayload(auth.credential), jwtSecret, {
          expiresIn: jwtExpiresIn
        });
        logger.debug(`BasicAuth`, `JWT issueed`, token);
        return { allow: true, context: { token } };
      }

      // Token authentication
      if (auth.type === "Bearer") {
        logger.debug(`BearerAuth`, auth.token);
        const decoded = jwt.verify(auth.token, jwtSecret);

        if (!decoded) {
          logger.debug(`BearerAuth`, `Failed`, auth.token);
          return { allow: false };
        }
        logger.debug(`BearerAuth`, `Decoded`, decoded);
        return { allow: true, context: { token: auth.token } };
      }

      // Unknown protocol
      return { allow: false };
    }
  });

export default buildJWTAuthorizer;
