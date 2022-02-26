import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { NgTransLangEnum, NG_TRANS_LOADER } from 'ng-trans';
import { HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: NG_TRANS_LOADER,
      useFactory: (http: HttpClient) => ({
        // https://github.com/ngx-translate/core/issues/1207#issuecomment-673921899
        // it is expecting to get the translation file using HTTP via absolute URL when angualr SSR.
        // so here overwride the lang file loader. 
        // And also can let the file's url be absolute URL via environment in AppModule
        [NgTransLangEnum.EN]: () => http.get('http://localhost:4200/assets/localization/en/translations.json'),
        [NgTransLangEnum.ZH_CN]: () => http.get('http://localhost:4200/assets/localization/zh-CN/translations.json'),
      }),
      deps: [HttpClient]
    }
  ]
})
export class AppServerModule { }
