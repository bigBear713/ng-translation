import { inject, TestBed } from '@angular/core/testing';
import { NgTranslationTestingModule } from '../ng-translation-testing.module';
import { NgTranslationService } from '../services/ng-translation.service';
import { handleSentenceWithParamsTestData } from '../tests';
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

  describe('#transform()', () => {
    handleSentenceWithParamsTestData.forEach(item => {
      it(item.title, inject([NgTranslationService], (service: NgTranslationService) => {
        const pipe = new NgTranslationContentPipe(service);
        const result = pipe.transform(item.test.trans, item.test.params);
        expect(result).toEqual(item.expect.result);
      }));
    });

  });



});
