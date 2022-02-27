import { NgTransService } from 'ng-trans';

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppService implements Resolve<Boolean> {

  constructor(
    private transService: NgTransService
  ) { }

  resolve(): Promise<boolean> {
    return this.transService.subscribeLoadDefaultOver().toPromise();
  }

}
