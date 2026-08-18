import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Play1 } from './play1';

describe('Play1', () => {
  let component: Play1;
  let fixture: ComponentFixture<Play1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Play1],
    }).compileComponents();

    fixture = TestBed.createComponent(Play1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
