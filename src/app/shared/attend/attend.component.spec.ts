import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendComponent } from './attend.component';

describe('AttendComponent', () => {
  let component: AttendComponent;
  let fixture: ComponentFixture<AttendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
