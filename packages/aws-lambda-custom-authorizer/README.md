# AWS Lambda custom authorizer simple builder

A simple function to build AWS Lambda custom authorizer easily.

## Usage

First, write a handler for authorization with an actual handler for HTTP event.

```typescript
import buildAuthorizer from "@yingyeothon/aws-lambda-custom-authorizer";

// Define the custom authorizer.
export const auth = buildAuthorizer({
  authorize: async (auth: Authorization) => {
    // "context" will be passed via `event.requestContext.authorizer` of APIGatewayProxy event.
    switch (auth.type) {
      case "Basic":
        // Authorization: Basic BASE64("id:password")
        // https://tools.ietf.org/html/rfc7617
        return auth.credential.id === "admin" &&
          auth.credential.password === "1234"
          ? { allow: true, context: { admin: true } }
          : { allow: false };
      case "Bearer":
        // Authorization: Bearer b64token
        // https://tools.ietf.org/html/rfc6750
        return auth.token === "verySecretToken"
          ? { allow: true, context: { token: auth.token } }
          : { allow: false };
    }
    // If "allow" is false, it would be cached a policy document of "Deny" access.
    return { allow: false };
  }
  /*
  onError: error => {
    console.error(error);
    throw new Error("Unauthorized");
  },
  logger: new ConsoleLogger("debug"),
  */
});

import { APIGatewayProxyHandler } from "aws-lambda";

// Define an actual HTTP handler.
export const hello: APIGatewayProxyHandler = async event => {
  // This handler is called only if "auth" Lambda generates a policy document to allow a request.
  // That is, if "auth" denies a request, this handler wouldn't be called.
  // And "context" will be passed to "event.requestContext.authorizer".
  return {
    statusCode: 200,
    body: JSON.stringify(event.requestContext.authorizer)
  };
};
```

And register that authorizer into `serverless.yml`.

```yaml
functions:
  # Register an authorizer Lambda.
  auth:
    handler: handler.auth
  hello:
    handler: handler.hello
    events:
      - http:
          method: get
          path: hello
          # And chain with that authorizer Lambda.
          authorizer: auth
```
