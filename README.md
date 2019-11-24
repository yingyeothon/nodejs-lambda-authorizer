# NodeJS AWS Lambda custom authorizer for Yingyeothon

A bundle of simple AWS Lambda custom authorizer libraries for [yingyeothon](https://yyt.life)'s infrastructure.

## List-up

Many of things would be deployed to [npmjs](https://www.npmjs.com/org/yingyeothon).

- [AWS Lambda custom authorizer](packages/aws-lambda-custom-authorizer)
- [AWS Lambda custom authorizer with JWT](packages/aws-lambda-jwt-custom-authorizer)

## Development

It uses [`lerna`](https://github.com/lerna/lerna) to manage multiple packages.

### Create a new

- Execute `create` command and copy `tsconfig.json` file from any other project.

```bash
lerna create new-package
cd packages/new-package
cp ../codec/tsconfig.json .
ln -s ../../tslint.json .
ln -s ../../jest.config.js .
ln -s ../../.vscode .
```

- Fill `package.json` file referencing any other project. Should fill up `typings`, `publishConfig` and `scripts.[tsc, build, test]`.

### Write a code and build

- Write its codes.
- Build with `lerna run tsc`.

If you want to build the only one package, please use `npm run build` in the specific package directory.

### Test

Write some test codes that import a library from JavaScript that built by `tsc`. Run `npm run test` command on **its root directory**.

If you want to test the only one package, please use `npm run test` in the specific package directory.

### Use other packages

If a package would reference other packages,

- First, `npm i --save @yingyeothon/package-name`.
- And do `lerna bootstrap`. It will make a symbolic link of a referenced package on its `node_modules` directory.

### Publish

- Check if its `README.md` is proper.
- Check if it can build to JavaScript properly.
- Check if it passes all tests we write.
- Check the version of this package.
- `npm publish` If you want to deploy it as alone.
- Or if you want to deploy all of them, do `npm run build` and `npm run deploy` at the root directory that deploy all things after build and test them.

## License

MIT
