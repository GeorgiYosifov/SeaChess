import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  @ViewChild('board') board: ElementRef;

  public readonly rows = [ '9', '8', '7', '6', '5', '4', '3', '2', '1', '0' ];
  public readonly cols = [ 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j' ]; //also colun 'a' added in html

  constructor(private gameService: GameService,
    private renderer: Renderer2) {
      this.gameService.rendererBoard = this.renderer;
    }

  ngAfterViewInit() {
    let cells: ElementRef[] = this.board.nativeElement.querySelectorAll('app-cell');
    this.gameService.setPlayerAbilities(cells);
  }
}
