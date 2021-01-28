import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';
import { CellComponent } from './cell/cell.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  public readonly rows = [ '9', '8', '7', '6', '5', '4', '3', '2', '1', '0' ];
  public readonly cols = [ 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j' ]; //also colun 'a' added in html
  
  @ViewChild(CellComponent) cell: CellComponent;

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
