import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupsOptionsComponent } from './pickups-options.component';

describe('PickupsOptionsComponent', () => {
  let component: PickupsOptionsComponent;
  let fixture: ComponentFixture<PickupsOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickupsOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupsOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
