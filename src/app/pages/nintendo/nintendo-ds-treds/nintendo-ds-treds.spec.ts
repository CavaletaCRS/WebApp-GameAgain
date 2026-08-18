import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NintendoDsTreds } from './nintendo-ds-treds';

describe('NintendoDsTreds', () => {
  let component: NintendoDsTreds;
  let fixture: ComponentFixture<NintendoDsTreds>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NintendoDsTreds],
    }).compileComponents();

    fixture = TestBed.createComponent(NintendoDsTreds);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
