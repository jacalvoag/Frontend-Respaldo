import { Component } from '@angular/core';
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

}
