import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { Comment } from '../../interfaces/interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coments',
  standalone: true,
  imports: [MatSidenavModule, MatDividerModule, CommonModule],
  templateUrl: './coments.component.html',
  styleUrl: './coments.component.scss'
})
export class ComentsComponent {
  @Input() comentData: Comment[] | undefined;
  @Input() valueClick?:any;
  @Output() valueClickClose = new EventEmitter<boolean>();

  close(clickValue: boolean){
    this.valueClickClose.emit(clickValue);
  }
}
