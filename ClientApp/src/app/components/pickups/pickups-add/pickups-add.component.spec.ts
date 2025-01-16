import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupsAddComponent } from './pickups-add.component';

describe('PickupsAddComponent', () => {
  let component: PickupsAddComponent;
  let fixture: ComponentFixture<PickupsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickupsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
