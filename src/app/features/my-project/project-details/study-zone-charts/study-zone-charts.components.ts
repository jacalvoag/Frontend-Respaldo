import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartModule, Color, ScaleType, LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-study-zone-charts',
  imports: [CommonModule, BarChartModule],
  templateUrl: './study-zone-charts.component.html',
  styleUrl: './study-zone-charts.component.css',
  standalone: true,
})
export class StudyZoneChartsComponent {

  @Input()
  public single: any[] = [];

  @Input()
  public xAxisLabel: string = '[name_zone]'; // Etiqueta del eje X y nombre de la zona

  public view: [number, number] = [300, 300]; 

  // Apariencia
  public showXAxis = true;
  public showYAxis = true;
  public showXAxisLabel = true;
  
  public colorScheme: Color = {
  domain: ['#5AA454', '#A10A28', '#C7B42C', '#4a3131ff'],
  group: ScaleType.Ordinal,
  name: 'biodiversity-graphic-indices',
  selectable: true,
  };
}
