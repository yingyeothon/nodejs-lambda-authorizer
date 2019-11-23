/// <reference types="node" />
import { IBasicCredential } from "@yingyeothon/aws-lambda-custom-authorizer";
import { ILogger } from "@yingyeothon/logger";
import { CustomAuthorizerHandler } from "aws-lambda";
interface IJWTAuthorizerArguments {
    jwtSecret: string;
    jwtExpiresIn?: string | number;
    buildJWTPayload?: <P extends string | object | Buffer>(credential: IBasicCredential) => P;
    login: (credential: IBasicCredential) => Promise<boolean>;
    logger?: ILogger;
}
declare type JWTAuthorizer = (parameters: IJWTAuthorizerArguments) => CustomAuthorizerHandler;
declare const buildJWTAuthorizer: JWTAuthorizer;
export default buildJWTAuthorizer;
