import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gameboy } from './gameboy';

describe('Gameboy', () => {
  let component: Gameboy;
  let fixture: ComponentFixture<Gameboy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gameboy],
    }).compileComponents();

    fixture = TestBed.createComponent(Gameboy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
