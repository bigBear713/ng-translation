/* tslint:disable:no-unused-variable */
import { Component, SimpleChange, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgTranslationTestingModule } from '../../ng-translation-testing.module';

import { NgTranslationSubcontentComponent } from './ng-translation-subcontent.component';

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

describe('NgTranslationSubcontentComponent', () => {
  let component: NgTranslationSubcontentComponent;
  let fixture: ComponentFixture<NgTranslationSubcontentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgTranslationTestingModule],
      declarations: [MockTplRefComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgTranslationSubcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
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

    const hostEle: HTMLElement = fixture.debugElement.nativeElement;
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

    const hostEle: HTMLElement = fixture.debugElement.nativeElement;
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

    const hostEle: HTMLElement = fixture.debugElement.nativeElement;
    const listFromDom = Array.from(hostEle.querySelectorAll('p')).map(item => item.textContent?.trim());
    expect(listFromDom).toEqual(mockList);
    expect(component.isString).toEqual(false);
  });

});
