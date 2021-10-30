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
import { trans } from './localization/zh-CN/translations';

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
      useValue: NgTranslationLangEnum.ZH_CN,
    },
    {
      provide: NG_TRANS_LOADER,
      useValue: {
        // dyn load
        [NgTranslationLangEnum.EN]: () => import('./localization/en/translations').then(data => data.trans),
        // direct load
        [NgTranslationLangEnum.ZH_CN]: trans,
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
