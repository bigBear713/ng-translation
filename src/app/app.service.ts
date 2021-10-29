import { NgTranslationService } from 'ng-translation';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppService implements CanActivate {

  constructor(
    private translationService: NgTranslationService
  ) { }

  canActivate(): Promise<boolean> {
    return this.translationService.subscribeLoadDefaultOverChange().toPromise();
  }

}
