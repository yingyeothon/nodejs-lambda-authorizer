import { IBasicCredential } from "@yingyeothon/aws-lambda-custom-authorizer";
import { CustomAuthorizerResult } from "aws-lambda";
import buildJWTAuthorizer from "..";

const anyContext: any = {};
const noCallback = () => 0;

const callAuthorizer = (id: string, password: string) =>
  buildJWTAuthorizer({
    jwtSecret: "test",
    login: async (credential: IBasicCredential) => {
      return credential.id === id && credential.password === password;
    }
  })(
    {
      type: "token",
      authorizationToken:
        "Basic " + Buffer.from("test:1234", "utf-8").toString("base64"),
      methodArn: "method-arn"
    },
    anyContext,
    noCallback
  ) as Promise<CustomAuthorizerResult>;

test("logged", async () => {
  const policy = await callAuthorizer("test", "1234");
  expect(policy.policyDocument.Statement[0].Effect).toEqual("Allow");
  expect(policy.context).toBeDefined();
  expect(policy.context!.token).toBeDefined();
});

test("denied", async () => {
  const policy = await callAuthorizer("test", "1111");
  expect(policy.policyDocument.Statement[0].Effect).toEqual("Deny");
  expect(policy.context).toBeUndefined();
});
