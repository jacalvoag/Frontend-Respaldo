import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewspecieFormComponent } from './newspecie-form.component';

describe('NewspecieFormComponent', () => {
  let component: NewspecieFormComponent;
  let fixture: ComponentFixture<NewspecieFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewspecieFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewspecieFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
