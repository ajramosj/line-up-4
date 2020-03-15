import { Component, OnInit } from '@angular/core';

import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  id: number;

  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit(): void {
    this.id = this.httpService.id
  }

  requestGame(friend: boolean): void {
    if (friend) {
      this.httpService.postOpponent(Number((<HTMLInputElement>(document.getElementById('opponent-id'))).value)).subscribe(() => this.router.navigate(['/wait']), () => alert("ID not found, try again..."))
    } else {
      this.httpService.postOpponent(0).subscribe(() => this.router.navigate(['/wait']))
    }
  }
}
