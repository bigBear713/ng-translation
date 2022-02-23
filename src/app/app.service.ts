import { NgTransService } from 'ng-trans';

import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppService implements CanActivate {

  constructor(
    private transService: NgTransService
  ) { }

  canActivate(): Promise<boolean> {
    return this.transService.subscribeLoadDefaultOverChange().toPromise();
  }

}
