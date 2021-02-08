import { Component, HostListener } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.startConnection();
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
