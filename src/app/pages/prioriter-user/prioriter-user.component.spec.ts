import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrioriterUserComponent } from './prioriter-user.component';

describe('PrioriterUserComponent', () => {
  let component: PrioriterUserComponent;
  let fixture: ComponentFixture<PrioriterUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrioriterUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrioriterUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
