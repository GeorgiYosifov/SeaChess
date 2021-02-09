import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';
import { CellComponent } from '../cell/cell.component';
import * as fromGameSelectors from 'src/app/modules/home/components/game/+store/game.selectors';
import { ICellView } from 'src/app/modules/shared/models/game/game-cell-view';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  @ViewChild('board') private board: ElementRef;
  @ViewChildren(CellComponent) private cellComponents: QueryList<CellComponent>;

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

  public selectEnemyCells() {
    this.gameService.storeGame.select(fromGameSelectors.getGameEnemyPlayerLastMovement).subscribe((cell: ICellView) => {
      this.cellComponents
        .find(component => component.id == cell.id && !cell.alreadyInPoint)
        .printCell(cell.iconType);
    });
  }
}
