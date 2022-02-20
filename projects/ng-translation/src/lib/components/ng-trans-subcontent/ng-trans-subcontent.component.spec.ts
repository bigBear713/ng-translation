import { Component, SimpleChange, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgTransTestingModule } from '../../ng-trans-testing.module';

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
    const changes: SimpleChanges = {
      content: new SimpleChange(undefined, content, true),
    };
    component.ngOnChanges(changes);

    fixture.detectChanges();

    expect(hostEle.textContent?.trim()).toEqual(content);
    expect(component.isString).toEqual(true);
  });

  it('the content is a templateRef type value', () => {
    const mockTplRefFixture = TestBed.createComponent(MockTplRefComponent);
    const mockTplRefComp = mockTplRefFixture.componentInstance;
    mockTplRefFixture.detectChanges();

    const content = mockTplRefComp.tplRef;
    component.content = content;
    const changes: SimpleChanges = {
      content: new SimpleChange(undefined, content, true),
    };
    component.ngOnChanges(changes);

    fixture.detectChanges();

    expect(hostEle.textContent?.trim()).toEqual(mockTplRefComp.content);
    expect(component.isString).toEqual(false);
  });

  it('the content is a templateRef type value with string list param', () => {
    const mockList = ['mock list 1', 'mock list 2'];

    const mockTplRefFixture = TestBed.createComponent(MockTplRefComponent);
    const mockTplRefComp = mockTplRefFixture.componentInstance;
    mockTplRefFixture.detectChanges();

    const content = mockTplRefComp.tplRefWithList;
    component.content = content;
    component.list = mockList;
    const changes: SimpleChanges = {
      content: new SimpleChange(undefined, content, true),
    };
    component.ngOnChanges(changes);

    fixture.detectChanges();

    const listFromDom = Array.from(hostEle.querySelectorAll('p')).map(item => item.textContent?.trim());
    expect(listFromDom).toEqual(mockList);
    expect(component.isString).toEqual(false);
  });

});