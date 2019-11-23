import { CustomAuthorizerResult } from "aws-lambda";
import buildAuthrozier from "..";

const callAuthorizer = (allow: boolean) =>
  buildAuthrozier({
    authorize: async () => {
      return { allow };
    }
  })(
    {
      type: "token",
      authorizationToken: "whatever",
      methodArn: "method-arn"
    },
    null,
    null
  ) as Promise<CustomAuthorizerResult>;

test("accepted", async () => {
  const policy = await callAuthorizer(true);
  expect(policy.policyDocument.Statement[0].Effect).toEqual("Allow");
});

test("denied", async () => {
  const policy = await callAuthorizer(false);
  expect(policy.policyDocument.Statement[0].Effect).toEqual("Deny");
});
