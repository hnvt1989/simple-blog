import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBlogPage } from './edit-blog.page';

describe('EditOfferPage', () => {
  let component: EditBlogPage;
  let fixture: ComponentFixture<EditBlogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBlogPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBlogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
