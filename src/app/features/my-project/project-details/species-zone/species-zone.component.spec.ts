import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeciesZoneComponent } from './species-zone.component';

describe('SpeciesZoneComponent', () => {
  let component: SpeciesZoneComponent;
  let fixture: ComponentFixture<SpeciesZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeciesZoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeciesZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
