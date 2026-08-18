import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameboyAdvance } from './gameboy-advance';

describe('GameboyAdvance', () => {
  let component: GameboyAdvance;
  let fixture: ComponentFixture<GameboyAdvance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameboyAdvance],
    }).compileComponents();

    fixture = TestBed.createComponent(GameboyAdvance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
