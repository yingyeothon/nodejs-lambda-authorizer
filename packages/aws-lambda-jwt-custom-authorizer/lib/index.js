"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_lambda_custom_authorizer_1 = require("@yingyeothon/aws-lambda-custom-authorizer");
const logger_1 = require("@yingyeothon/logger");
const jwt = require("jsonwebtoken");
const buildJWTAuthorizer = ({ jwtSecret, jwtExpiresIn = "30m", buildJWTPayload = ({ id }) => ({ id }), login, logger = logger_1.nullLogger }) => aws_lambda_custom_authorizer_1.default({
    authorize: (auth) => __awaiter(this, void 0, void 0, function* () {
        if (auth.type === "Basic") {
            logger.debug(`BasicAuth`, auth.credential.id);
            if (!(yield login(auth.credential))) {
                logger.debug(`BasicAuth`, `Failed`, auth.credential.id);
                return { allow: false };
            }
            const token = jwt.sign(buildJWTPayload(auth.credential), jwtSecret, {
                expiresIn: jwtExpiresIn
            });
            logger.debug(`BasicAuth`, `JWT issueed`, token);
            return { allow: true, context: { token } };
        }
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
        return { allow: false };
    })
});
exports.default = buildJWTAuthorizer;
//# sourceMappingURL=index.js.map