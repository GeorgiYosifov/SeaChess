import { Component, HostListener, OnInit } from '@angular/core';
import { faTimes as faCross, faCircle } from '@fortawesome/free-solid-svg-icons';
import { GameService } from 'src/app/core/services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  public readonly rows = [ '9', '8', '7', '6', '5', '4', '3', '2', '1', '0' ];
  public readonly cols = [ 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j' ]; //also colun 'a' add in html
  faCross = faCross;
  faCircle = faCircle;
  
  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.startConnection();
  }

  move(id: string) {
    this.gameService.markCell(id);
  }

  ngOnDestroy() {
    this.beforeUnload();
  }

  @HostListener('window:beforeunload')
  private beforeUnload() {
    this.gameService.endConnection();
  }
}
