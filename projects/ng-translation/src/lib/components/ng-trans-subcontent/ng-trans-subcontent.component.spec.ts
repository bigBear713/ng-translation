import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgTransTestingModule } from '../../testing/ng-trans-testing.module';
import { NgTransSubcontentComponent } from './ng-trans-subcontent.component';

@Component({
  selector: 'mock-tpl-ref',
  template: `
    <ng-template #tplRef>{{content}}</ng-template>

    <ng-template #tplRefWithList let-list="list">
      <p *ngFor="let item of list">{{item}}</p>
    </ng-template>
  `,
})
export class MockTplRefComponent {
  @ViewChild('tplRef') tplRef!: TemplateRef<any>;
  @ViewChild('tplRefWithList') tplRefWithList!: TemplateRef<any>;

  content = 'mock templateRef content';
}

describe('Component: NgTransSubcontent', () => {
  let component: NgTransSubcontentComponent;
  let fixture: ComponentFixture<NgTransSubcontentComponent>;
  let hostEle: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgTransTestingModule],
      declarations: [MockTplRefComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgTransSubcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    hostEle = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('the content is a string value', () => {
    const content = 'test content';
    component.content = content;

    detectChanges();

    expect(hostEle.textContent?.trim()).toEqual(content);
  });

  it('the content is a templateRef type value', () => {
    const mockTplRefFixture = TestBed.createComponent(MockTplRefComponent);
    const mockTplRefComp = mockTplRefFixture.componentInstance;
    mockTplRefFixture.detectChanges();

    const content = mockTplRefComp.tplRef;
    component.content = content;

    detectChanges();

    expect(hostEle.textContent?.trim()).toEqual(mockTplRefComp.content);
  });

  it('the content is a templateRef type value with string list param', () => {
    const mockList = ['mock list 1', 'mock list 2'];

    const mockTplRefFixture = TestBed.createComponent(MockTplRefComponent);
    const mockTplRefComp = mockTplRefFixture.componentInstance;
    mockTplRefFixture.detectChanges();

    const content = mockTplRefComp.tplRefWithList;
    component.content = content;
    component.list = mockList;

    detectChanges();

    const listFromDom = Array.from(hostEle.querySelectorAll('p')).map(item => item.textContent?.trim());
    expect(listFromDom).toEqual(mockList);
  });

  function detectChanges() {
    const changeDR = fixture.componentRef.injector.get(ChangeDetectorRef);
    changeDR.markForCheck();
    fixture.detectChanges();
  }
});
