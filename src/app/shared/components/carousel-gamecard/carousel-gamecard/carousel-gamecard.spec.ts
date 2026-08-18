import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselGamecard } from './carousel-gamecard';

describe('CarouselGamecard', () => {
  let component: CarouselGamecard;
  let fixture: ComponentFixture<CarouselGamecard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselGamecard],
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselGamecard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
