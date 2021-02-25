import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';
import * as fromGameSelectors from 'src/app/modules/home/components/game/+store/game.selectors';
import { IconType } from 'src/app/modules/shared/models/game/player-icon-type';
import { IPlayerStat } from 'src/app/modules/shared/models/game/player-stat';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent {
  private defaultPlayer: IPlayerStat = {
    id: '',
    email: '',
    score: 0,
    isOnTurn: false,
    iconType: IconType.None,
    time: 5 * 60
  };

  public firstPlayer: IPlayerStat = this.defaultPlayer;
  public secondPlayer: IPlayerStat = this.defaultPlayer;

  @ViewChild('player1') private firstPlayerElement: ElementRef;
  @ViewChild('player2') private secondPlayerElement: ElementRef;
  @ViewChild('player1Timer') private firstPlayerTimerElement: ElementRef;
  @ViewChild('player2Timer') private secondPlayerTimerElement: ElementRef;

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
      this.startTimer();
    });
  }

  public changeBackgroundColor() {
    if (this.firstPlayerElement == undefined || this.secondPlayerElement == undefined)
      return;

    if (this.firstPlayer.isOnTurn) {
      if (this.firstPlayer.iconType == IconType.Cross) {
        this.renderer.setStyle(this.firstPlayerElement.nativeElement, "background-color", "red");
      } else if (this.firstPlayer.iconType == IconType.Circle) {
        this.renderer.setStyle(this.firstPlayerElement.nativeElement, "background-color", "green");
      }
    } else {
      this.renderer.removeStyle(this.firstPlayerElement.nativeElement, "background-color");
    }

    if (this.secondPlayer.isOnTurn) {
      if (this.secondPlayer.iconType == IconType.Cross) {
        this.renderer.setStyle(this.secondPlayerElement.nativeElement, "background-color", "red");
      } else if (this.secondPlayer.iconType == IconType.Circle) {
        this.renderer.setStyle(this.secondPlayerElement.nativeElement, "background-color", "green");
      }
    } else {
      this.renderer.removeStyle(this.secondPlayerElement.nativeElement, "background-color");
    }
  }

  public startTimer() {
    if (this.firstPlayer.isOnTurn) {
      this.timerAction(this.firstPlayer.time, this.firstPlayerTimerElement);
    } else if (this.secondPlayer.isOnTurn) {
      this.timerAction(this.secondPlayer.time, this.secondPlayerTimerElement);
    }
  }

  private async timerAction(playerTime: number, playerTimer: ElementRef) {
    if (playerTime == 0) playerTime = 5 * 60;

    const interval = 1000; // ms
    const then = Date.now();
    let expected = Date.now() + interval;
    const renderer = this.renderer;
    const gameService = this.gameService;
    const printTime = this.printTime;

    setTimeout(step, interval);
    function step() {
      const dt = Date.now() - expected;

      if (expected >= then + playerTime * 1000) {
        console.log('HI THERE');
      }

      const remains = ((then + 60 * 1000) - expected) / 1000;
      const value = printTime(remains);
      renderer.setProperty(playerTimer.nativeElement, 'innerHTML', value);
      
      gameService.storeGame.select(fromGameSelectors.getGamePlayerOnTurnTime).subscribe((data: { playerId: string, time: number }) => {
        return;
      }).unsubscribe();
      
      expected += interval;
      setTimeout(step, Math.max(0, interval - dt)); // take into account drift
    }
  }

  public printTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = (Math.round(time % 60)).toString();
    return `${minutes}:${seconds.length == 2 ? seconds : '0' + seconds}`;
  }
}

//on second turn start time
//after fiftieth turn end the game