import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewzoneFormComponent } from './newzone-form.component';

describe('NewzoneFormComponent', () => {
  let component: NewzoneFormComponent;
  let fixture: ComponentFixture<NewzoneFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewzoneFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewzoneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
