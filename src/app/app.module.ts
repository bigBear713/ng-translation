import {
    NG_TRANS_DEFAULT_LANG,
    NG_TRANS_LOADER,
    NgTranslationLangEnum,
    NgTranslationModule
} from 'ng-translation';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgTranslationModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: NG_TRANS_DEFAULT_LANG,
      useValue: NgTranslationLangEnum.EN,
    },
    {
      provide: NG_TRANS_LOADER,
      useValue: {
        [NgTranslationLangEnum.EN]: () => import('./localization/en/translations').then(data => data.trans),
        [NgTranslationLangEnum.ZH_CN]: () => import('./localization/zh-CN/translations').then(data => data.trans),
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
