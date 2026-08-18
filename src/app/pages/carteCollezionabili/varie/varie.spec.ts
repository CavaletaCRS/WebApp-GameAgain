import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Varie } from './varie';

describe('Varie', () => {
  let component: Varie;
  let fixture: ComponentFixture<Varie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Varie],
    }).compileComponents();

    fixture = TestBed.createComponent(Varie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
