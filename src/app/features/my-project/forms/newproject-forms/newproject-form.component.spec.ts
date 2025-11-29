import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProjectFormComponent } from './newproject-form.component';

describe('NewprojectFormsComponent', () => {
  let component: NewProjectFormComponent;
  let fixture: ComponentFixture<NewProjectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProjectFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProjectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
