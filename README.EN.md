<div align="center">

### @bigbear713/ng-trans

Angular i18n translation component.

[OnlineDemo](https://bigBear713.github.io/ng-translation/)

[Bug Report](https://github.com/bigBear713/ng-translation/issues)

[Feature Request](https://github.com/bigBear713/ng-translation/issues)

</div>

## Attention
- The component has been deprecated, `v16` version will not be released, `v15` is the last version. We recommend you to use the `@bigbear713/nb-trans` or other components.

## Document
- [中文](https://github.com/bigBear713/ng-translation/blob/master/projects/ng-translation/README.md "中文文档")
- [English](https://github.com/bigBear713/ng-translation/blob/master/projects/ng-translation/README.EN.md "English Document")


## Feature
- Support to direct/lazing loading translation file;
- Support to update translation content in page directly and no need to reload page;
- Support to reset the max retry time when failure to load the translation file;
- Support there are some params in translation sentence;
- Support there are some components in the translation sentence;
- Support the changeDetection of components as `ChangeDetectionStrategy.OnPush`;
- Support to used in `standalone component`;

## Installation
```bash
$ npm i @bigbear713/ng-trans
// or
$ yarn add @bigbear713/ng-trans
```

## Start the demo project
- Install the dependencies:
```bash
npm i
```

- Build the ng-trans lib
```bash
npm run build:lib
```

- Start the demo
```bash
npm start
```

- build the demo
```bash
npm run build
```

- Start the demo with SSR
```bash
npm run dev:ssr
```

- Build the demo with SSR
```bash
npm run build:ssr

npm run serve:ssr
```
## Contribution
> Feature and PR are welcome to make this project better together

<a href="https://github.com/bigBear713" target="_blank"><img src="https://avatars.githubusercontent.com/u/12368900?v=4" alt="bigBear713" width="30px" height="30px"></a>

## License
MIT
