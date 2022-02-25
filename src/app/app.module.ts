import {
  NG_TRANS_DEFAULT_LANG,
  NG_TRANS_LOADER,
  NgTransLangEnum,
  NgTransModule,
  NG_TRANS_MAX_RETRY_TOKEN
} from 'ng-trans';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { trans } from './localization/zh-CN/translations';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgTransModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    // {
    //   provide: NG_TRANS_MAX_RETRY_TOKEN,
    //   useValue: 0
    // },
    {
      provide: NG_TRANS_DEFAULT_LANG,
      useValue: NgTransLangEnum.ZH_CN,
    },
    // {
    //   provide: NG_TRANS_LOADER,
    //   useValue: {
    //     // dyn load and the content is a ts file
    //     [NgTransLangEnum.EN]: () => import('./localization/en/translations').then(data => data.trans),
    //     [NgTransLangEnum.ZH_CN]: () => import('./localization/zh-CN/translations').then(data => data.trans),
    //     // direct load
    //     // [NgTranslationLangEnum.ZH_CN]: trans,
    //   },
    // },
    {
      provide: NG_TRANS_LOADER,
      useFactory: (http: HttpClient) => ({
        // dyn load and the content is a json file
        // [NgTransLangEnum.EN]: () => http.get('./assets/localization/en/translations.json').toPromise(),
        [NgTransLangEnum.EN]: () => http.get('./assets/localization/en/translations.json'),
        // [NgTransLangEnum.ZH_CN]: () => http.get('./assets/localization/zh-CN/translations.json').toPromise(),
        [NgTransLangEnum.ZH_CN]: () => http.get('./assets/localization/zh-CN/translations.json'),
      }),
      deps: [HttpClient]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
