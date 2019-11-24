"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@yingyeothon/logger");
const http401Error = "Unauthorized";
const splitByDelimiter = (data, delim) => {
    const pos = data.indexOf(delim);
    return pos > 0 ? [data.substr(0, pos), data.substr(pos + 1)] : ["", ""];
};
const parseAuthorization = (token) => {
    const [type, credential] = splitByDelimiter(token, " ");
    if (type === "Basic") {
        const decoded = Buffer.from(credential, "base64")
            .toString("utf8")
            .trim();
        const [id, password] = splitByDelimiter(decoded, ":");
        return { type, credential: { id, password } };
    }
    else if (type === "Bearer") {
        return { type, token: credential };
    }
    return { type: "Unknown", scheme: type, credential };
};
const defaultErrorHandler = (logger) => (error) => {
    logger.error(error);
    throw new Error(http401Error);
};
const buildAuthorizer = ({ authorize, onError: maybeOnError, logger = logger_1.nullLogger }) => (event) => __awaiter(void 0, void 0, void 0, function* () {
    let authorized = {
        allow: false
    };
    try {
        logger.debug(`authorization
    Token`, event.authorizationToken);
        if (event.authorizationToken === undefined) {
            throw new Error(`No authorizationToken`);
        }
        const authorization = parseAuthorization(event.authorizationToken);
        logger.debug(`authorization`, authorization);
        authorized = yield authorize(authorization);
        logger.debug(`authorized`, authorized);
    }
    catch (error) {
        const onError = maybeOnError || defaultErrorHandler(logger);
        onError(error);
    }
    const policy = {
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
});
exports.default = buildAuthorizer;
//# sourceMappingURL=index.js.map