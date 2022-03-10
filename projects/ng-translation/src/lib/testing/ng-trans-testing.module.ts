import { NgModule } from "@angular/core";
import { NgTransModule } from "../ng-trans.module";
import { NgTransService, NgTransToolsService } from "../services";

@NgModule({
  providers: [
    NgTransService,
    NgTransToolsService,
  ],
  exports: [NgTransModule]
})
export class NgTransTestingModule { }