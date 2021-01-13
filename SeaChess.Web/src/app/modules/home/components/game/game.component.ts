import { Component, HostListener, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { GameService } from 'src/app/core/services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  public rows = [ '9', '8', '7', '6', '5', '4', '3', '2', '1', '0' ];
  public cols = [ 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j' ];
  faTimes = faTimes;
  
  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.startConnection();
  }

  ngOnDestroy() {
    this.beforeUnload();
  }

  @HostListener('window:beforeunload')
  private beforeUnload() {
    this.gameService.endConnection();
  }
}
