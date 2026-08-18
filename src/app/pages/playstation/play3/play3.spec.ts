import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Play3 } from './play3';

describe('Play3', () => {
  let component: Play3;
  let fixture: ComponentFixture<Play3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Play3],
    }).compileComponents();

    fixture = TestBed.createComponent(Play3);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
