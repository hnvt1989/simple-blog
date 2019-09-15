import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBlogsPage } from './myblogs.page';

describe('OffersPage', () => {
  let component: MyBlogsPage;
  let fixture: ComponentFixture<MyBlogsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBlogsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBlogsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
