import { NgModule } from "@angular/core";
import { NgTransModule } from "../ng-trans.module";
import { NgTransService } from "../services";

@NgModule({
  providers: [
    NgTransService
  ],
  exports: [NgTransModule]
})
export class NgTransTestingModule { }