import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddresautocompleteComponent } from './addresautocomplete.component';

describe('AddresautocompleteComponent', () => {
  let component: AddresautocompleteComponent;
  let fixture: ComponentFixture<AddresautocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddresautocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddresautocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
