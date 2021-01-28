import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { faTimes as faCross, faCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { GameService } from 'src/app/core/services/game.service';
import { IconType } from 'src/app/modules/shared/models/game/player-icon-type';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent {
  faCross = faCross;

  @ViewChild('td') td: ElementRef;
  @Input() id: string;
  @Input() icon: IconDefinition;

  constructor(private gameService: GameService,
    private renderer: Renderer2,
    private host: ElementRef) {
      this.gameService.rendererCell = this.renderer;
    }

  ngAfterViewInit() {
    this.createBlackOrWhiteCell();
    this.estimateCellContent();
  }
  
  markCell() {
    const result: { isMarked: boolean, iconType: IconType } = this.gameService.markCell(this.id);
    if (!result.isMarked) {
      if (result.iconType == IconType.Cross) {
        const divIcon: ElementRef = this.renderer.createElement('div');
        const faIcon: ElementRef = this.renderer.createElement('fa-icon');
        this.renderer.addClass(divIcon, 'icon');
        //divIcon.nativeElement.innerHTML = '<fa-icon [icon]=' + faCross + '></fa-icon>';
        this.renderer.setProperty(faIcon, 'icon', faCross);
        this.renderer.appendChild(divIcon, faIcon);
        this.renderer.appendChild(this.td.nativeElement, divIcon);
      } else if (result.iconType == IconType.Circle) {
        const divIcon = this.renderer.createElement('div');
        this.renderer.addClass(divIcon, 'icon');
        this.renderer.appendChild(divIcon, faCircle);
        this.renderer.appendChild(this.td.nativeElement, divIcon);
      }
    }
  }

  private estimateCellContent() {
    const row: string = this.id[0];
    const col: string = this.id[1];
    if (row != '0' && col == 'a') {
      const firstSpan = this.renderer.createElement('span');
      this.renderer.addClass(firstSpan, 'index-top-left');
      const firstSpanText = this.renderer.createText(row);

      this.renderer.appendChild(firstSpan, firstSpanText);
      this.renderer.appendChild(this.td.nativeElement, firstSpan);
    } else if (row == '0' && col == 'a') {
      const firstSpan = this.renderer.createElement('span');
      this.renderer.addClass(firstSpan, 'index-top-left');
      const firstSpanText = this.renderer.createText(row);

      const secondSpan = this.renderer.createElement('span');
      this.renderer.addClass(secondSpan, 'index-bottom-right');
      const secondSpanText = this.renderer.createText(col);

      this.renderer.appendChild(firstSpan, firstSpanText);
      this.renderer.appendChild(this.td.nativeElement, firstSpan);

      this.renderer.appendChild(secondSpan, secondSpanText);
      this.renderer.appendChild(this.td.nativeElement, secondSpan);
    } else if (row == '0' && col != 'a') {
      const firstSpan = this.renderer.createElement('span');
      this.renderer.addClass(firstSpan, 'index-bottom-right');
      const firstSpanText = this.renderer.createText(col);

      this.renderer.appendChild(firstSpan, firstSpanText);
      this.renderer.appendChild(this.td.nativeElement, firstSpan);
    }
  }

  private createBlackOrWhiteCell() {
    const row: number = Number(this.id[0]);
    const col: number = this.id[1].charCodeAt(0);
    if ((row % 2 != 0 && col % 2 == 0) || (row % 2 == 0 && col % 2 != 0)) {
        this.renderer.addClass(this.host.nativeElement, 'styleCell');
    }
  }
}