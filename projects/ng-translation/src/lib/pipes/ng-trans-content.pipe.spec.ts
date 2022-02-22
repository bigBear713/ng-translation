import { TestBed } from '@angular/core/testing';
import { NgTransTestingModule } from '../ng-trans-testing.module';
import { NgTransCoreService } from '../services/ng-trans-core.service';
import { handleSentenceWithParamsTestData } from '../tests';
import { NgTransContentPipe } from './ng-trans-content.pipe';

describe('Pipe: NgTransContente', () => {
  let pipe: NgTransContentPipe;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgTransTestingModule],
      declarations: []
    })
      .compileComponents();
  });

  beforeEach(() => {
    const transCoreService = TestBed.inject(NgTransCoreService);
    pipe = new NgTransContentPipe(transCoreService)
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('#transform()', () => {
    handleSentenceWithParamsTestData.forEach(item => {
      it(item.title, () => {
        const result = pipe.transform(item.test.trans, item.test.params);
        expect(result).toEqual(item.expect.result);
      });
    });

  });

});
