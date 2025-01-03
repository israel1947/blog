import { Component, inject, Input } from '@angular/core';
import { CarrucelData, Post } from '../../interfaces/interface';
import { CarrucelComponent } from '../../components/carrucel/carrucel.component';
import { CardComponent } from "../../components/card/card.component";
import { PostsService } from '../../services/posts.service';
import { CommonModule } from '@angular/common';
import { MoreComponent } from '../../components/more/more.component';

@Component({
  selector: 'app-category',
  imports: [CarrucelComponent, CardComponent, CommonModule, MoreComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {

  @Input('category') category!: string;
  @Input('postsCategory') postsCategory: Post[] = [];
  @Input('carrucelCategory') carrucelCategory: CarrucelData[] = [];
  @Input('latesNewsCategory') latesNewsCategory: Post[] = [];

  isLoading = false;
  clasType2Card: string[] = ['container--card', 'flex', 'justify-center', 'gap-[10px]', 'flex-col', 'cursor-pointer'];

  getResponse(resp:Post[]){
    return resp.map((e)=>{
      this.postsCategory.push(e);
      
    })
  }
}
