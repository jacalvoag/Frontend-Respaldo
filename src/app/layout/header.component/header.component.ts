import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserService } from "../../core/services/user.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() currentPage: string = 'Home';
  userName: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserName();
  }

  loadUserName(): void {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.userName = user.fullName || 'Usuario';
      },
      error: (err) => {
        console.error('Error cargando nombre de usuario:', err);
        this.userName = 'Usuario';
      }
    });
  }
}