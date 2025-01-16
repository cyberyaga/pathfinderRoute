import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingBoundaryComponent } from './pricing-boundary.component';

describe('PricingBoundaryComponent', () => {
  let component: PricingBoundaryComponent;
  let fixture: ComponentFixture<PricingBoundaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingBoundaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingBoundaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
