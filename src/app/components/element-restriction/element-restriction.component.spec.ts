import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementRestrictionComponent } from './element-restriction.component';

describe('ElementRestrictionComponent', () => {
  let component: ElementRestrictionComponent;
  let fixture: ComponentFixture<ElementRestrictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElementRestrictionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementRestrictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
