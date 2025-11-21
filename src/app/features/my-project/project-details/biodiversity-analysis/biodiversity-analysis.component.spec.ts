import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiodiversityAnalysisComponent } from './biodiversity-analysis.component';

describe('BiodiversityAnalysisComponent', () => {
  let component: BiodiversityAnalysisComponent;
  let fixture: ComponentFixture<BiodiversityAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiodiversityAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiodiversityAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
