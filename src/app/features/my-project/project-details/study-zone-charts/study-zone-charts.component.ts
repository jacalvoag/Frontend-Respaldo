import { Component, Input, } from '@angular/core'; // <-- Aquí mero*
import { CommonModule } from '@angular/common';
import { BarChartModule, Color, ScaleType, LegendPosition } from '@swimlane/ngx-charts';

// *Si se necesita mayor rendimiento hay que importar  ChangeDetectionStrategy


@Component({
  selector: 'app-study-zone-charts',
  imports: [CommonModule, BarChartModule],
  templateUrl: './study-zone-charts.component.html',
  styleUrl: './study-zone-charts.component.css',
  standalone: true,
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyZoneChartsComponent {

  @Input() public single: any[] = [];
  @Input() public xAxisLabel: string = ''; // Etiqueta del eje X y nombre de la zona

  public view: [number, number] = [300, 300]; 

  // Apariencia
  public showXAxis = true;
  public showYAxis = true;
  public showXAxisLabel = true;
  
  public colorScheme: Color = {
  domain: ['#689F38', '#33691E', '#7CB342', '#558B2F'],
  group: ScaleType.Ordinal,
  name: 'biodiversity-graphic-indices',
  selectable: true,
  };
}
