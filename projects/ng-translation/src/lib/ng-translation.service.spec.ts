import { TestBed } from '@angular/core/testing';

import { NgTranslationService } from './ng-translation.service';

describe('NgTranslationService', () => {
  let service: NgTranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgTranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
