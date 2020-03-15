import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  id: number;
  opponentId: number;
  socket: any;
  firstPlayer: boolean;

  constructor(private http: HttpClient) { }

  getId(): any {
    return this.http.get('id');
  }

  postOpponent(opponentId: number): any {
    return this.http.post('opponent', JSON.stringify({ id: this.id, opponentId: opponentId }), { headers: new HttpHeaders().set('Content-Type', 'application/json') });
  }
}