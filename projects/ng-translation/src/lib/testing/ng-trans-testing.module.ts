import { NgModule } from "@angular/core";
import { NgTransModule } from "../ng-trans.module";
import { NgTransService } from "../services/ng-trans.service";

@NgModule({
  providers: [
    NgTransService
  ],
  exports: [NgTransModule]
})
export class NgTransTestingModule { }