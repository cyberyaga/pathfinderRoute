import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppOptionsComponent } from './app-options.component';

describe('AppOptionsComponent', () => {
  let component: AppOptionsComponent;
  let fixture: ComponentFixture<AppOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
