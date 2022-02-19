import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgTranslationTestingModule } from '../../ng-translation-testing.module';

import { NgTranslationComponent } from './ng-translation.component';

describe('Component: NgTranslation', () => {
  let component: NgTranslationComponent;
  let fixture: ComponentFixture<NgTranslationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgTranslationTestingModule],
      declarations: []
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgTranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});
