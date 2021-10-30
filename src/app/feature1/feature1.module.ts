import { NgTranslationModule } from 'ng-translation';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { Feature1Component } from './feature1.component';
import { Feature1RoutingModule } from './feature1.routing.module';

@NgModule({
  imports: [
    CommonModule,
    NgTranslationModule,
    Feature1RoutingModule
  ],
  declarations: [Feature1Component]
})
export class Feature1Module { }