import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCarte } from './home-carte';

describe('HomeCarte', () => {
  let component: HomeCarte;
  let fixture: ComponentFixture<HomeCarte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCarte],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeCarte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
