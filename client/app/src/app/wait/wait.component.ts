import { Component, OnInit } from '@angular/core';

import { HttpService } from '../http.service';
import { Router } from '@angular/router';
declare var io: any;

@Component({
  selector: 'app-wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.css']
})
export class WaitComponent implements OnInit {
  id: number;

  constructor(private router: Router, private httpService: HttpService) { }

  ngOnInit(): void {
    this.id = this.httpService.id;

    this.httpService.socket = io(window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1));
    this.httpService.socket.emit('id', this.httpService.id);
    this.httpService.socket.on('game', (data: any) => {
      this.httpService.opponentId = data.opponentId;
      this.httpService.firstPlayer = data.firstPlayerId == this.httpService.id;
      this.router.navigate(['/play'])
    });
  }
}