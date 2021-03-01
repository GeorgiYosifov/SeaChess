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
  @ViewChild('firstPlayerElement') private firstPlayerElement: ElementRef;
  @ViewChild('firstPlayerTimer') private firstPlayerTimerElement: ElementRef;  
  @ViewChild('secondPlayerElement') private secondPlayerElement: ElementRef;
  @ViewChild('secondPlayerTimer') private secondPlayerTimerElement: ElementRef;

  private iconTypeColor: { [key in IconType]: string } = ['none', 'red', 'green'];

  public stopTimer: { value: boolean } = { value: false };
  public firstPlayer: IPlayerStat;
  public secondPlayer: IPlayerStat;

  constructor(private gameService: GameService,
    private renderer: Renderer2) { }

  public uploadPlayersStat() {
    this.gameService.storeGame.select(fromGameSelectors.getGamePlayersStat).subscribe((data: IPlayerStat[]) => {
      if (data.length == 0)
        return;

      this.firstPlayer = data[0];
      this.secondPlayer = data[1];
      this.changeBackgroundColor();
      this.setEachPlayerTimer();
    }).unsubscribe();
  }

  private changeBackgroundColor() {
    if (this.firstPlayer.isOnTurn) {
      this.renderer.setStyle(this.firstPlayerElement.nativeElement, "background-color", this.iconTypeColor[this.firstPlayer.iconType]);
    } else {
      this.renderer.removeStyle(this.firstPlayerElement.nativeElement, "background-color");
    }

    if (this.secondPlayer.isOnTurn) {
      this.renderer.setStyle(this.secondPlayerElement.nativeElement, "background-color", this.iconTypeColor[this.secondPlayer.iconType]);
    } else {
      this.renderer.removeStyle(this.secondPlayerElement.nativeElement, "background-color");
    }  
  }

  private setEachPlayerTimer() {
    if (this.firstPlayer.isOnTurn) {
      this.startTimer(this.firstPlayer, this.firstPlayerTimerElement);
      this.printTime(this.renderer, this.secondPlayerTimerElement, this.getTimeToString(this.secondPlayer.time));
    } else if (this.secondPlayer.isOnTurn) {
      this.startTimer(this.secondPlayer, this.secondPlayerTimerElement);
      this.printTime(this.renderer, this.firstPlayerTimerElement, this.getTimeToString(this.firstPlayer.time));
    }
  }

  private startTimer(player: IPlayerStat, playerTimerElement: ElementRef) {
    const interval: number = 1000; // ms
    let expected: number = Date.now() + interval;
    const endTime: number = Date.now() + player.time;

    let stopTimer = this.stopTimer;
    const renderer: Renderer2 = this.renderer;
    const getTimeToString = this.getTimeToString;
    const printTime = this.printTime;

    let stack: any;
    setTimeout(step, interval);

    function step() {
      if (expected >= endTime && stack != undefined) {
        console.log('End game');
        return stop();
      }
      if (stopTimer.value && stack != undefined) {
        console.log('Switch timer');
        return stop();
      }

      const dt = Date.now() - expected;
      const remainingTime = endTime - expected; // ms
      player.time = remainingTime;
      printTime(renderer, playerTimerElement, getTimeToString(remainingTime));
      
      expected += interval;
      stack = setTimeout(step, Math.max(0, interval - dt)); // take into account drift
    }

    function stop() {   
      clearTimeout(stack);
      stopTimer.value = false;
      stack = undefined;
    }
  }

  public getTimeToString(time: number): string {
    const minutes = Math.floor(time / (60 * 1000));
    const seconds = (Math.round((time / 1000) % 60)).toString();
    return `${minutes}:${seconds.length > 1 ? seconds : '0' + seconds}`;
  }

  private printTime(renderer: Renderer2, playerTimerElement: ElementRef, timeToString: string) {
    renderer.setProperty(playerTimerElement.nativeElement, 'innerHTML', timeToString);
  }
}

//on second turn start time
//after fiftieth turn end the game