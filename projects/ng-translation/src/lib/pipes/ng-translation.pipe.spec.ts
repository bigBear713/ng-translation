import { TestBed, async } from '@angular/core/testing';
import { NgTranslationTestingModule } from '../ng-translation-testing.module';
import { NgTranslationService } from '../services/ng-translation.service';
import { NgTranslationPipe } from './ng-translation.pipe';

describe('Pipe: NgTranslatione', () => {
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
    let pipe = new NgTranslationPipe(transService);
    expect(pipe).toBeTruthy();
  });

});
