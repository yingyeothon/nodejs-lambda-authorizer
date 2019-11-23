# AWS Lambda custom authorizer with JWT

A simple function to build easily AWS Lambda custom authorizer with JWT.

## Usage

```typescript
import buildAuthorizer from "@yingyeothon/aws-lambda-jwt-custom-authorizer";
import { CustomAuthorizerHandler } from "aws-lambda";

// Define the custom authorizer.
export const auth: CustomAuthorizerHandler = buildAuthorizer({
  jwtSecret: "verySecret",
  login: async ({ id, password }) => {
    // Define only the login method.
    return id === "admin" && password === "1234";
  }
  // jwtExpiresIn: "30m", // The expiration of that JWT.
  // buildJWTPayload: ({ id, password }) => ({ id } as any), // A function to build a payload that is in JWT.
  // logger: nullLogger
});

// Define an actual HTTP handler.
export const hello: APIGatewayProxyHandler = async event => {
  // This handler is called only if "auth" Lambda generates a policy document to allow a request.
  // That is, if "auth" denies a request, this handler wouldn't be called.
  // "event.requestContext.authorizer" is { token: JWT } from "auth" method.
  return {
    statusCode: 200,
    body: JSON.stringify(event.requestContext.authorizer)
  };
};
```
