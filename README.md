# NodeJS Toolkit for Yingyeothon

A bundle of small libraries for [yingyeothon](https://yyt.life)'s infrastructure.

## List-up

Many of things would be deployed to [npmjs](https://www.npmjs.com/org/yingyeothon).

### Actor system

- [Event broker](packages/event-broker)
- [Codec](packages/codec)
- [In-memory Actor system](packages/actor-system)
- [Redis support Actor system](packages/actor-system-redis-support)

### Repository

- [Repository interface](packages/repository)
- [Repository using AWS S3](packages/repository-s3)
- [Repository using Redis](packages/repository-redis)

## Development

It uses [`lerna`](https://github.com/lerna/lerna) to manage multiple packages.

### Create a new

- Execute `create` command and copy `tsconfig.json` file from any other project.

```bash
lerna create new-package
cd packages/new-package
cp ../codec/tsconfig.json .
```

- Fill `package.json` file referencing any other project. Should fill up `typings`, `publishConfig` and `scripts.tsc`.

### Write a code and build

- Write its codes.
- Build with `lerna run tsc`.

### Test

- Write some test codes that import a library from JavaScript that built by `tsc`. Run `npm run test` command on **its root directory**.

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
- Or `npm run deploy` on **its root directory** if you want to deploy all of these packages with above processes such as building, testing and publishing.

## License

MIT
