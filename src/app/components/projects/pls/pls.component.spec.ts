import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlsComponent } from './pls.component';

describe('PlsComponent', () => {
  let component: PlsComponent;
  let fixture: ComponentFixture<PlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
