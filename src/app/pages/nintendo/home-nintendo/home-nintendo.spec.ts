import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeNintendo } from './home-nintendo';

describe('HomeNintendo', () => {
  let component: HomeNintendo;
  let fixture: ComponentFixture<HomeNintendo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeNintendo],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeNintendo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
