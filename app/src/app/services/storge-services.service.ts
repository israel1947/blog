import { inject, Injectable } from '@angular/core';
import { Post } from '../interfaces/interface';
import { SnackbarService } from '../shared/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class StorgeServicesService {

  posts: Post[] = [];

  private snakService: SnackbarService = inject(SnackbarService);

  async savePosts(postData: any) {
    let exist: boolean = false;
    let message: string = '';

    for (let post of this.posts) {
      if (post._id === postData._id) {
        exist = true;
        break;
      }
    }
    if (exist) {
      this.posts = this.posts.filter((resp) => resp._id !== postData._id);
      message = 'Removed of favorites';
    } else {
      this.posts.push(postData);
      message = 'Added to favorites';
    }

    this.snakService.alertBar(message);
    localStorage.setItem('postsSaved', JSON.stringify(this.posts));
    return !exist;
  }

  async loadFavorites() {
    const storedFavorites = await localStorage.getItem('postsSaved');
    if (storedFavorites) {
      this.posts = JSON.parse(storedFavorites) || [];
    }
    return this.posts;
  }

  async postsExist(id: string) {
    await this.loadFavorites();
    const exist = this.posts.find(post => post._id === id);
    return (exist) ? true : false;
  }
}
