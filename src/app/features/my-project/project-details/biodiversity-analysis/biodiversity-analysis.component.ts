import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet, RouterLinkWithHref, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from '../../../../core/models/project.model';
import { ProjectService } from '../../../../core/services/project.service';
import { filter } from 'rxjs';


@Component({
  selector: 'app-biodiversity-analysis',
  imports: [RouterLink],
  templateUrl: './biodiversity-analysis.component.html',
  styleUrl: './biodiversity-analysis.component.css',
})
export class BiodiversityAnalysisComponent {

}
