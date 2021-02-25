import { Component, HostListener, ViewChild } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';
import { BoardComponent } from './board/board.component';
import { StatsComponent } from './stats/stats.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  @ViewChild(BoardComponent) board: BoardComponent;
  @ViewChild(StatsComponent) stats: StatsComponent;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.startConnection();
  }

  ngAfterViewInit() {
    this.gameService.attachReferencesOfComponents(this.board, this.stats)
    this.gameService.addYourTurnListener();
  }

  ngOnDestroy() {
    this.beforeUnload();
  }

  @HostListener('window:beforeunload')
  private beforeUnload() {
    this.gameService.endConnection();
  }
}
