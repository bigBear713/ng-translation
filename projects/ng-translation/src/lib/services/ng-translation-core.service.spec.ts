import { TestBed, inject } from '@angular/core/testing';
import { NgTranslationCoreService } from './ng-translation-core.service';

describe('Service: NgTranslationCore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgTranslationCoreService]
    });
  });

  it('should ...', inject([NgTranslationCoreService], (service: NgTranslationCoreService) => {
    expect(service).toBeTruthy();
  }));
});
