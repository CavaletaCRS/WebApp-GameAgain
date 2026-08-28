import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllGames } from './all-games';

describe('AllGames', () => {
  let component: AllGames;
  let fixture: ComponentFixture<AllGames>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllGames],
    }).compileComponents();

    fixture = TestBed.createComponent(AllGames);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
