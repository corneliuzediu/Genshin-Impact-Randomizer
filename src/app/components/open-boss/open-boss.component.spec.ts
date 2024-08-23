import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenBossComponent } from './open-boss.component';

describe('OpenBossComponent', () => {
  let component: OpenBossComponent;
  let fixture: ComponentFixture<OpenBossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenBossComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenBossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
