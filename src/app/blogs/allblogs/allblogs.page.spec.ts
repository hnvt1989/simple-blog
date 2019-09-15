import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBlogsPage } from './allblogs.page';

describe('DiscoverPage', () => {
  let component: AllBlogsPage;
  let fixture: ComponentFixture<AllBlogsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllBlogsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllBlogsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
