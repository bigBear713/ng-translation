import { NgModule } from "@angular/core";
import { NgTranslationModule } from "./ng-translation.module";
import { NgTranslationService } from "./services/ng-translation.service";

@NgModule({
  providers: [
    NgTranslationService
  ],
  exports: [NgTranslationModule]
})
export class NgTranslationTestingModule { }