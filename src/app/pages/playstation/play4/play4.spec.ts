import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Play4 } from './play4';

describe('Play4', () => {
  let component: Play4;
  let fixture: ComponentFixture<Play4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Play4],
    }).compileComponents();

    fixture = TestBed.createComponent(Play4);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
