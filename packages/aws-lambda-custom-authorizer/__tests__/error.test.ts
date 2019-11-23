import buildAuthrozier from "..";

const callAuthorizer = ({
  allow,
  errorMessage
}: {
  allow: "allow" | "deny" | "error";
  errorMessage?: string;
}) =>
  new Promise<Error | null>(async resolve => {
    await buildAuthrozier({
      authorize: async () => {
        if (allow === "error") {
          throw new Error(errorMessage);
        }
        return { allow: allow === "allow" };
      },
      onError: resolve
    })(
      {
        type: "token",
        authorizationToken: "whatever",
        methodArn: "method-arn"
      },
      null,
      null
    );
    // No error in here.
    resolve(null);
  });

test("accepted", async () => {
  const shouldBeNull = await callAuthorizer({ allow: "allow" });
  expect(shouldBeNull).toBeNull();
});

test("error-in-authorizer", async () => {
  const errorMessage = "NotAllowed";
  const error = await callAuthorizer({ allow: "error", errorMessage });
  expect(error.message).toEqual(errorMessage);
});
