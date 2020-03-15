import { Component, OnInit } from '@angular/core';

import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    document.getElementById('start-button').addEventListener('click', this.play.bind(this), false);   //Note the use of bind()
  }

  play(): void {
    this.httpService.getId().subscribe((data: any) => {
      this.httpService.id = data.id;
      this.router.navigate(['/dashboard'])
    })
  }
}