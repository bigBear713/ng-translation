import {
  NG_TRANS_DEFAULT_LANG,
  NG_TRANS_LOADER,
  NgTransLangEnum,
  NgTransModule,
  NG_TRANS_MAX_RETRY_TOKEN,
  WARN_DEPRECATED_TOKEN
} from 'ng-trans';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Feature2Component } from './feature2/feature2.component';

@NgModule({
  declarations: [	
    AppComponent,
   ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    NgTransModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    // {
    //   provide: WARN_DEPRECATED_TOKEN,
    //   useValue: false
    // },
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
    //     // [NgTransLangEnum.ZH_CN]: trans,
    //   },
    // },
    {
      provide: NG_TRANS_LOADER,
      useFactory: (http: HttpClient) => ({
        // https://github.com/ngx-translate/core/issues/1207#issuecomment-673921899
        // it is expecting to get the translation file using HTTP via absolute URL when angualr SSR.
        // So here change the file's path as relative/absolute via environment

        // dyn load and the content is a json file
        // [NgTransLangEnum.EN]: () => http.get('./assets/localization/en/translations.json').toPromise(),
        [NgTransLangEnum.EN]: () => http.get(environment.domain + 'assets/localization/en/translations.json'),
        // [NgTransLangEnum.ZH_CN]: () => http.get('./assets/localization/zh-CN/translations.json').toPromise(),
        [NgTransLangEnum.ZH_CN]: () => http.get(environment.domain + 'assets/localization/zh-CN/translations.json'),
      }),
      deps: [HttpClient]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
