import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencehomeComponent } from './preferencehome.component';

describe('PreferencehomeComponent', () => {
  let component: PreferencehomeComponent;
  let fixture: ComponentFixture<PreferencehomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferencehomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencehomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
