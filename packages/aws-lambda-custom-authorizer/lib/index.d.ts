import { ILogger } from "@yingyeothon/logger";
import { AuthResponseContext, CustomAuthorizerResult } from "aws-lambda";
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
export declare type Authorization = IBasicAuthorization | IBearerAuthorization | IUnknownAuthorization;
export interface IAuthorized {
    allow: boolean;
    context?: AuthResponseContext;
}
declare type Authorizer = (authorization: Authorization) => Promise<IAuthorized>;
interface IHandlerArguments {
    authorize: Authorizer;
    onError?: (error: Error) => void;
    logger?: ILogger;
}
declare const buildAuthorizer: ({ authorize, onError: maybeOnError, logger }: IHandlerArguments) => import("aws-lambda").Handler<import("aws-lambda").CustomAuthorizerEvent, CustomAuthorizerResult>;
export default buildAuthorizer;
