/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { NgTranslationTestingModule } from '../ng-translation-testing.module';
import { NgTranslationService } from '../ng-translation.service';
import { NgTranslationContentPipe } from './ng-translation-content.pipe';

describe('Pipe: NgTranslationContente', () => {
  let transService: NgTranslationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgTranslationTestingModule],
      declarations: []
    })
      .compileComponents();
  });

  beforeEach(() => {
    transService = TestBed.inject(NgTranslationService);
  });

  it('create an instance', () => {
    let pipe = new NgTranslationContentPipe(transService);
    expect(pipe).toBeTruthy();
  });
});
