import { NgTranslationLangEnum } from '../models/ng-translation-lang.enum';

export const transLoader = {
  dynamicLoader: {
    [NgTranslationLangEnum.EN]: () => import('./localization/en/translations').then(data => data.trans),
    [NgTranslationLangEnum.ZH_CN]: () => import('./localization/zh-CN/translations').then(data => data.trans),
  },
  staticLoader: {
    [NgTranslationLangEnum.EN]: {
      title: 'title  ',
      content: {
        'helloWorld': 'hello world',
      }
    },
    [NgTranslationLangEnum.ZH_CN]: {
      title: '标题  ',
      content: {
        'helloWorld': '你好，世界',
      }
    },
  }
}; 