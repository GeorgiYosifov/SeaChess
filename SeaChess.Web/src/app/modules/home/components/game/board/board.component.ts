import { Component, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';
import { CellComponent } from '../cell/cell.component';
import { ICellView } from 'src/app/modules/shared/models/game/game-cell-view';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  @ViewChildren(CellComponent) private cellComponents: QueryList<CellComponent>;

  public readonly rows = [ '9', '8', '7', '6', '5', '4', '3', '2', '1', '0' ];
  public readonly cols = [ 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j' ]; //also colun 'a' added in html

  constructor(private gameService: GameService,
    private renderer: Renderer2) {
      this.gameService.rendererBoard = this.renderer;
  }

  public printEnemyLastMovement(cell: ICellView) {
    this.cellComponents
      .find(component => component.id == cell.id)
      .printCell(cell.iconType);
  }

  public printPoint(cells: ICellView[]) {
    cells.forEach(c => {
      this.cellComponents
        .find(component => component.id == c.id)
        .colorizeCell(c.iconType);
    });
  }
}
