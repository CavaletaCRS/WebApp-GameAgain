import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniatureOggettistica } from './miniature-oggettistica';

describe('MiniatureOggettistica', () => {
  let component: MiniatureOggettistica;
  let fixture: ComponentFixture<MiniatureOggettistica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniatureOggettistica],
    }).compileComponents();

    fixture = TestBed.createComponent(MiniatureOggettistica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
