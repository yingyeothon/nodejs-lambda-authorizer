import buildAuthrozier, { Authorization } from "..";

const anyContext: any = {};
const noCallback = () => 0;

const callAuthorizer = (authorizationToken: string) =>
  new Promise<Authorization>(resolve =>
    buildAuthrozier({
      authorize: async credential => {
        resolve(credential);
        return { allow: true };
      }
    })(
      {
        type: "token",
        authorizationToken,
        methodArn: "method-arn"
      },
      anyContext,
      noCallback
    )
  );

test("basic", async () => {
  const id = "test";
  const password = "1234";
  const credential = await callAuthorizer(
    `Basic ${Buffer.from(`${id}:${password}`, "utf-8").toString("base64")}`
  );
  expect(credential.type).toEqual("Basic");

  // Only for type guard
  if (credential.type === "Basic") {
    expect(credential.credential).toEqual({ id, password });
  }
});

test("bearer", async () => {
  const token = "something great";
  const credential = await callAuthorizer(`Bearer ${token}`);
  expect(credential.type).toEqual("Bearer");

  // Only for type guard
  if (credential.type === "Bearer") {
    expect(credential.token).toEqual(token);
  }
});

test("unknown", async () => {
  const data = "very complicated expression";
  const credential = await callAuthorizer(`Digest ${data}`);
  expect(credential.type).toEqual("Unknown");

  // Only for type guard
  if (credential.type === "Unknown") {
    expect(credential.scheme).toEqual("Digest");
    expect(credential.credential).toEqual(data);
  }
});
