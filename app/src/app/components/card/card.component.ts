import { Component, Input } from '@angular/core';
import { Post, Posts } from '../../interfaces/interface';
import { CommonModule } from '@angular/common';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { RouterModule } from '@angular/router';
import {MatDividerModule} from '@angular/material/divider';
import { ImagenPipe } from '../../pipes/imagen.pipe';


@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, CustomDatePipe, RouterModule, MatDividerModule, ImagenPipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() post:Partial<Post> = {};
  @Input() classType!: string[];
  @Input() cardType: 'primary' | 'secondary' | 'tertiary' = 'primary';



}
