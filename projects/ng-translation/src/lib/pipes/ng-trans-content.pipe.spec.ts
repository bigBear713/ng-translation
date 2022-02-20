import { TestBed } from '@angular/core/testing';
import { NgTransTestingModule } from '../ng-trans-testing.module';
import { NgTransService } from '../services/ng-trans.service';
import { handleSentenceWithParamsTestData } from '../tests';
import { NgTransContentPipe } from './ng-trans-content.pipe';

describe('Pipe: NgTransContente', () => {
  let transService: NgTransService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgTransTestingModule],
      declarations: []
    })
      .compileComponents();
  });

  beforeEach(() => {
    transService = TestBed.inject(NgTransService);
  });

  it('create an instance', () => {
    let pipe = new NgTransContentPipe(transService);
    expect(pipe).toBeTruthy();
  });

  describe('#transform()', () => {
    handleSentenceWithParamsTestData.forEach(item => {
      it(item.title, () => {
        const pipe = new NgTransContentPipe(transService);
        const result = pipe.transform(item.test.trans, item.test.params);
        expect(result).toEqual(item.expect.result);
      });
    });

  });

});
