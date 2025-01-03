import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import { Post } from '../../interfaces/interface';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-more',
  imports: [CommonModule],
  templateUrl: './more.component.html',
  styleUrl: './more.component.scss'
})
export class MoreComponent {
  @Input('isLoading') isLoading!: boolean;
  @Input('category') category?: string;
  @Input('userID') userID?: any;


  @Output() postsCategory: EventEmitter<Post[]> = new EventEmitter();
  @Output() postsForUserId: EventEmitter<Post[]> = new EventEmitter();


  //services
  private postsService: PostsService = inject(PostsService);


  more(event: Event, pull: boolean = false) {
    this.isLoading = !this.isLoading;
    this.postsService.getAllPosts(pull).subscribe((resp) => {
      if (this.userID) {
        const morePosts = resp.posts.filter((post) => post.user_id === this.userID);
        if (morePosts) {
          this.isLoading = false;
          this.postsForUserId.emit(morePosts);
        }
        
      } else {
        const morePosts = resp.posts.filter((post) => post.category === this.category);
        if (morePosts) {
          this.isLoading = false;
          this.postsCategory.emit(morePosts)
        }
      }
      if (event) {
        event.target?.addEventListener('click', () => {
          pull = true;
        })
      }
    })
  }


}
