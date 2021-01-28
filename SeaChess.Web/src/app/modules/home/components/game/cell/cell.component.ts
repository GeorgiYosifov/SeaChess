import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { faTimes as faCross, faCircle } from '@fortawesome/free-solid-svg-icons';
import { GameService } from 'src/app/core/services/game.service';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent {
  public faCross = faCross;
  public faCircle = faCircle;

  @ViewChild('td') td: ElementRef;

  @Input() id: string;

  constructor(private gameService: GameService,
    private renderer: Renderer2,
    private host: ElementRef) { }

  ngAfterViewInit() {
    this.createBlackOrWhiteCell();
    this.estimateCellContent();
  }
  
  markCell() {
    this.gameService.markCell(this.id);
  }

  private estimateCellContent() {
    let row: string = this.id[0];
    let col: string = this.id[1];
    if (row != '0' && col == 'a') {
      let firstSpan = this.renderer.createElement('span');
      this.renderer.addClass(firstSpan, 'index-top-left');
      let firstSpanText = this.renderer.createText(row);

      this.renderer.appendChild(firstSpan, firstSpanText);
      this.renderer.appendChild(this.td.nativeElement, firstSpan);
    } else if (row == '0' && col == 'a') {
      let firstSpan = this.renderer.createElement('span');
      this.renderer.addClass(firstSpan, 'index-top-left');
      let firstSpanText = this.renderer.createText(row);

      let secondSpan = this.renderer.createElement('span');
      this.renderer.addClass(secondSpan, 'index-bottom-right');
      let secondSpanText = this.renderer.createText(col);

      this.renderer.appendChild(firstSpan, firstSpanText);
      this.renderer.appendChild(this.td.nativeElement, firstSpan);

      this.renderer.appendChild(secondSpan, secondSpanText);
      this.renderer.appendChild(this.td.nativeElement, secondSpan);
    } else if (row == '0' && col != 'a') {
      let firstSpan = this.renderer.createElement('span');
      this.renderer.addClass(firstSpan, 'index-bottom-right');
      let firstSpanText = this.renderer.createText(col);

      this.renderer.appendChild(firstSpan, firstSpanText);
      this.renderer.appendChild(this.td.nativeElement, firstSpan);
    }
  }

  private createBlackOrWhiteCell() {
    let row: number = Number(this.id[0]);
    let col: number = this.id[1].charCodeAt(0);
    if ((row % 2 != 0 && col % 2 == 0) || (row % 2 == 0 && col % 2 != 0)) {
        this.renderer.addClass(this.host.nativeElement, 'styleCell');
      }
    }
  }