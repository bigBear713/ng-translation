import { Inject, NgModule, Optional } from "@angular/core";
import { deprecatedTip, WARN_DEPRECATED } from "../constants";
import { NgTransModule } from "../ng-trans.module";
import { NgTransService, NgTransToolsService } from "../services";

@NgModule({
  providers: [
    NgTransService,
    NgTransToolsService,
  ],
  exports: [NgTransModule]
})
export class NgTransTestingModule {
  constructor(@Inject(WARN_DEPRECATED) @Optional() warnDeprecated: boolean) {
    if (warnDeprecated !== false) {
      console.warn(deprecatedTip);
    }
  }
}