import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedRoutesComponent } from './assigned-routes.component';

describe('AssignedRoutesComponent', () => {
  let component: AssignedRoutesComponent;
  let fixture: ComponentFixture<AssignedRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
