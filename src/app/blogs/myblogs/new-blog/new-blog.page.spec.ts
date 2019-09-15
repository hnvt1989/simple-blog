import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBlogPage } from './new-blog.page';

describe('NewOfferPage', () => {
  let component: NewBlogPage;
  let fixture: ComponentFixture<NewBlogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBlogPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBlogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
