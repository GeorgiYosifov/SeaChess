import { Component, HostListener, ViewChild } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';
import { BoardComponent } from './board/board.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  @ViewChild(BoardComponent) board: BoardComponent;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.startConnection();
  }

  ngAfterViewInit() {
    this.gameService.addYourTurnListener(this.board);
  }

  ngOnDestroy() {
    this.beforeUnload();
  }

  @HostListener('window:beforeunload')
  private beforeUnload() {
    this.gameService.endConnection();
  }
}
