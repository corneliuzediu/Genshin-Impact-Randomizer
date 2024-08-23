import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyBossComponent } from './weekly-boss.component';

describe('WeeklyBossComponent', () => {
  let component: WeeklyBossComponent;
  let fixture: ComponentFixture<WeeklyBossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyBossComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyBossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
