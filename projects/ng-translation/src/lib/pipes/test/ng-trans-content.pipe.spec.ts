import { TestBed } from '@angular/core/testing';
import { NgTransToolsService } from '../../services';
import { handleSentenceWithParamsTestData, NgTransTestingModule } from '../../testing';
import { NgTransContentPipe } from '../ng-trans-content.pipe';

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
    const transToolsService = TestBed.inject(NgTransToolsService);
    pipe = new NgTransContentPipe(transToolsService)
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
