import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';
import * as fromGameSelectors from 'src/app/modules/home/components/game/+store/game.selectors';
import { IPlayerStat } from 'src/app/modules/shared/models/game/player-stat';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent {
  private defaultPlayer: IPlayerStat = {
    email: "",
    score: 0,
    isOnTurn: false
  };

  public firstPlayer: IPlayerStat = this.defaultPlayer;
  public secondPlayer: IPlayerStat = this.defaultPlayer;

  @ViewChild('player1') private firstPlayerElement: ElementRef;
  @ViewChild('player2') private secondPlayerElement: ElementRef;

  constructor(private gameService: GameService,
    private renderer: Renderer2) {
      this.uploadPlayersStat();
  }

  public uploadPlayersStat() {
    this.gameService.storeGame.select(fromGameSelectors.getGamePlayersStat).subscribe((players: IPlayerStat[]) => {
      if (players.length == 0) 
        return;

      this.firstPlayer = players[0];
      this.secondPlayer = players[1];
      this.changeBackgroundColor();
    });
  }

  public changeBackgroundColor() {
    if (this.firstPlayerElement == undefined || this.secondPlayerElement == undefined)
      return;

    if (this.firstPlayer.isOnTurn) {
      this.renderer.addClass(this.firstPlayerElement.nativeElement, "color-player");
    } else {
      this.renderer.removeClass(this.firstPlayerElement.nativeElement, "color-player");
    }

    if (this.secondPlayer.isOnTurn) {
      this.renderer.addClass(this.secondPlayerElement.nativeElement, "color-player");
    } else {
      this.renderer.removeClass(this.secondPlayerElement.nativeElement, "color-player");
    }
  }
}