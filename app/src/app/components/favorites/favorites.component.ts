import { Component, OnInit } from '@angular/core';
import { Post } from '../../interfaces/interface';
import { CardComponent } from "../card/card.component";
import { StorgeServicesService } from '../../services/storge-services.service';

@Component({
  selector: 'app-favorites',
  imports: [CardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {

  favoritesPosts: Post[] = [];

  constructor(private a: StorgeServicesService) { }


  ngOnInit(): void {
    const storedPosts = localStorage.getItem('postsSaved');
    if (storedPosts) {
      this.favoritesPosts = JSON.parse(storedPosts);
    }

  }
}
