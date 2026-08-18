import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Play2 } from './play2';

describe('Play2', () => {
  let component: Play2;
  let fixture: ComponentFixture<Play2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Play2],
    }).compileComponents();

    fixture = TestBed.createComponent(Play2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
