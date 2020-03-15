import { Component, OnInit, Inject } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css'],
})
export class PlayComponent implements OnInit {
  id: number;
  opponentId: number;
  firstPlayer: boolean;
  circles: string[];
  piecesCount: number;
  status: string;
  board: number[][];

  readonly StatusString = {
    YOU: "Your turn!",
    OPPONENT: "Your opponent's turn...",
    LOSER: "GAME OVER, you lost... 😔",
    WINNER: "CONGRATULATIONS, you won! 🥳"
  };

  constructor(public dialog: MatDialog, private httpService: HttpService) { }

  ngOnInit(): void {
    this.id = this.httpService.id;
    this.opponentId = this.httpService.opponentId;
    this.firstPlayer = this.httpService.firstPlayer;

    this.circles = [];
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 7; j++) {
        this.circles.push(i.toString() + j.toString());
      }
    }

    this.piecesCount = 0;
    if (this.firstPlayer) {
      this.status = this.StatusString.YOU;
    } else {
      this.status = this.StatusString.OPPONENT;
    }
    this.board = [];
    for (var i = 0; i < 6; i++) {
      this.board[i] = []
      for (var j = 0; j < 7; j++) {
        this.board[i][j] = 0;
      }
    }

    this.httpService.socket.on('move', (data: any) => {
      if (data.hole != null) {
        this.makeMove(Math.floor(data.hole / 10), data.hole % 10, data.playerId == this.id)
        if (data.playerId != this.id) {
          this.status = this.StatusString.YOU;
        } else {
          this.status = this.StatusString.OPPONENT;
        }
      } else {
        if (data.playerId == this.id) {
          this.status = this.StatusString.WINNER;
        } else {
          this.status = this.StatusString.LOSER;
        }
      }
    });
  }

  ngAfterViewInit(): void {
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 7; j++) {
        document.getElementById(i.toString() + j.toString()).addEventListener('click', this.selectColumn.bind(this), false);    //Note the use of bind()
      }
    }
  }

  makeMove(i: number, j: number, thisPlayer: boolean): void {
    if (thisPlayer) {
      this.board[i][j] = this.firstPlayer ? 1 : 2;
      document.getElementById(i.toString() + j.toString()).style.backgroundColor = this.firstPlayer ? 'rgb(102, 255, 153)' : 'rgb(153, 102, 255)'
      if (this.checkLineUp4(i, j)) {
        this.httpService.socket.emit('move', { id: this.id, hole: null });
      } else {
        this.piecesCount = this.piecesCount + 1;
      }
    } else {
      this.board[i][j] = this.firstPlayer ? 2 : 1;
      document.getElementById(i.toString() + j.toString()).style.backgroundColor = this.firstPlayer ? 'rgb(153, 102, 255)' : 'rgb(102, 255, 153)'
    }
  }

  selectColumn(e): void {
    var j = Number(e.target.id.substr(1, 1));

    if (this.status == this.StatusString.YOU) {
      if (this.piecesCount == 42) {
        alert("It is a tie! Start a new game...");
      } else {
        var isInserted = false;
        for (var i = 5; i >= 0; i--) {
          if (this.board[i][j] == 0) {
            this.httpService.socket.emit('move', { id: this.id, hole: Number(i.toString() + j.toString()) });
            isInserted = true;
            break;
          }
        }
        if (!isInserted) {
          alert("This column is full! Try again...")
        }
      }
    } else {
      alert("It is not your turn...")
    }
  }

  showInstructions(): void {
    this.dialog.open(InstructionsDialog);
  }

  checkLineUp4(r: number, c: number): boolean {
    var winner: boolean = false;
    var count: number = 0;


    for (var i = Math.max(0, r - 3); i < Math.min(5, r + 3); i++) {       //Check column
      if (this.board[i][c] == this.board[i + 1][c] && this.board[i][c] != 0) { count++; }
    }
    if (count >= 3) { winner = true; }
    if (!winner) {
      count = 0;
      for (var j = Math.max(0, c - 3); j < Math.min(6, c + 3); j++) {       //Check row
        if (this.board[r][j] == this.board[r][j + 1] && this.board[r][j] != 0) { count++; }
      }
      if (count >= 3) { winner = true; }
    }

    return winner;
  };
}

// Dialog
@Component({
  selector: 'instructions',
  templateUrl: 'instructions.html'
})
export class InstructionsDialog {
  constructor(public dialogRef: MatDialogRef<InstructionsDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}