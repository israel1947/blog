import { Component, Input } from '@angular/core';
import { CarrucelData, Post } from '../../interfaces/interface';
import { CarrucelComponent } from '../../components/carrucel/carrucel.component';
import { CardComponent } from "../../components/card/card.component";

@Component({
    selector: 'app-category',
    imports: [CarrucelComponent, CardComponent],
    templateUrl: './category.component.html',
    styleUrl: './category.component.scss'
})
export class CategoryComponent {

  @Input('category') category!: string;
  @Input('postsCategory') postsCategory: Post[] = [];
  @Input('carrucelCategory') carrucelCategory: CarrucelData[] = [];
  @Input('latesNewsCategory') latesNewsCategory: Post[] = [];

  clasType2Card: string[] = ['container--card', 'flex', 'justify-center', 'gap-[10px]', 'flex-col', 'cursor-pointer'];
}
