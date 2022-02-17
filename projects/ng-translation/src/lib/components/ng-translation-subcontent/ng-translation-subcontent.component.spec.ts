/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgTranslationSubcontentComponent } from './ng-translation-subcontent.component';

describe('NgTranslationSubcontentComponent', () => {
  let component: NgTranslationSubcontentComponent;
  let fixture: ComponentFixture<NgTranslationSubcontentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgTranslationSubcontentComponent]
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
});
