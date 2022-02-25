import { Component, SimpleChange, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import { NG_TRANS_LOADER } from '../../constants';
import { NgTransLangEnum } from '../../models';
import { NgTransTestingModule } from '../../ng-trans-testing.module';
import { NgTransService } from '../../services';
import { NgTransToolsService } from '../../services/ng-trans-tools.service';
import { transLoader } from '../../tests';
import { NgTransComponent } from './ng-trans.component';

@Component({
  selector: 'comp1',
  template: `
    <ng-content></ng-content>
  `,
})
export class MockComp1Component {
}

@Component({
  selector: 'mock-tpl-ref',
  template: `
    <ng-template #tpl1 let-content="content" let-list="list">
      <div class="has-subcontent" [ng-trans-subcontent]="content" [trans-subcontent-list]="list"></div>
    </ng-template>
    <ng-template #tpl2 let-content="content"><comp1>{{content}}</comp1></ng-template>
  `,
})
export class MockTplRefComponent {
  @ViewChild('tpl1') tpl1!: TemplateRef<any>;
  @ViewChild('tpl2') tpl2!: TemplateRef<any>;
}

describe('Component: NgTrans', () => {
  let component: NgTransComponent;
  let fixture: ComponentFixture<NgTransComponent>;
  let transToolsService: NgTransToolsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgTransTestingModule],
      declarations: [MockTplRefComponent, MockComp1Component],
      providers: [
        { provide: NG_TRANS_LOADER, useValue: transLoader.staticLoader },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    transToolsService = TestBed.inject(NgTransToolsService);

    fixture = TestBed.createComponent(NgTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnChanges()', () => {
    const spyFn = spyOn(transToolsService, 'handleTrans').and.callThrough();

    component.key = 'title';
    component.options = {};
    const changes = {
      key: new SimpleChange(undefined, component.key, true),
      options: new SimpleChange(undefined, component.options, true),
    };
    component.ngOnChanges(changes);

    expect(spyFn).toHaveBeenCalledTimes(1);
  });

  it('verify has subscribed lang change event', (done) => {
    const transService = TestBed.inject(NgTransService);
    spyOn(transService, 'subscribeLangChange').and.callThrough();
    spyOn(transToolsService, 'handleTrans').and.callThrough();

    component.key = 'title';
    component.options = {};

    transService.changeLang(NgTransLangEnum.EN).pipe(take(1)).subscribe(() => {
      expect(transToolsService.handleTrans).toHaveBeenCalledTimes(1);
      done();
    });

  });

  describe('verify the UI', () => {
    let tpls: TemplateRef<any>[] = [];
    let uiComp: NgTransComponent;
    let uiFixture: ComponentFixture<NgTransComponent>;
    let hostEle: HTMLElement;

    beforeEach(() => {
      const tplFixture = TestBed.createComponent(MockTplRefComponent);
      const tplComp = tplFixture.componentInstance;
      tplFixture.detectChanges();
      tpls = [tplComp.tpl1, tplComp.tpl2];

      uiFixture = TestBed.createComponent(NgTransComponent);
      uiComp = uiFixture.componentInstance;
      uiFixture.detectChanges();
      hostEle = uiFixture.debugElement.nativeElement;
    });

    beforeEach(async () => {
      const transService = TestBed.inject(NgTransService);
      return transService.subscribeLoadDefaultOverChange().toPromise();
    });

    it(`the content is string`, () => {
      uiComp.key = 'title';
      uiComp.components = [];
      const changes = {
        key: new SimpleChange(undefined, uiComp.key, true),
      };
      uiComp.ngOnChanges(changes);
      uiFixture.detectChanges();

      expect(hostEle.textContent?.trim()).toEqual('标题');
    });

    it(`the content is component`, () => {
      uiComp.key = 'component';
      uiComp.components = [tpls[1]];
      const changes = {
        key: new SimpleChange(undefined, uiComp.key, true),
      };
      uiComp.ngOnChanges(changes);
      uiFixture.detectChanges();

      const comp1Instance = hostEle.querySelector('comp1');
      expect(!!comp1Instance).toEqual(true);
      expect(comp1Instance?.textContent?.trim()).toEqual('组件');
    });

    it(`the content is complex component`, () => {
      uiComp.key = 'complexComponent';
      uiComp.components = tpls;
      const changes = {
        key: new SimpleChange(undefined, uiComp.key, true),
      };
      uiComp.ngOnChanges(changes);
      uiFixture.detectChanges();

      const hasSubContentEle = hostEle.querySelector('div.has-subcontent');
      expect(!!hasSubContentEle).toEqual(true);
      expect(hasSubContentEle?.textContent?.trim()).toEqual('组件0组件1');

      const comp1Instance = hasSubContentEle?.querySelector('comp1');
      expect(!!comp1Instance).toEqual(true);
      expect(comp1Instance?.textContent?.trim()).toEqual('组件1');
    });

  });

});
