import { Component, inject, OnInit, signal } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute } from '@angular/router';
import { Comment, Post, User } from '../../interfaces/interface';
import { CommonModule } from '@angular/common';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { MatChipsModule } from '@angular/material/chips';
import { ComentsComponent } from '../../components/coments/coments.component';
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { ImagenProfilePipe } from '../../pipes/imagen-profile.pipe';
import { response } from 'express';
import { SnackbarService } from '../../shared/snackbar.service';
import { StorgeServicesService } from '../../services/storge-services.service';

@Component({
  selector: 'app-post',
  imports: [CommonModule, CustomDatePipe, MatChipsModule, ComentsComponent, ImagenPipe, ImagenProfilePipe],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  postData: Partial<Post> = {};
  userData!: User;
  comentData: Partial<Comment>[] = [];
  route: ActivatedRoute = inject(ActivatedRoute);
  showFiller = false;
  userId!: any;
  post_id!: any;
  urlSahre!: string;
  favoriteIcons:string = 'ri-bookmark-line ri-xl';

  private comentsService: PostsService = inject(PostsService)
  private postServices: PostsService = inject(PostsService);
  private snakServie: SnackbarService = inject(SnackbarService);
  private storageService:StorgeServicesService = inject(StorgeServicesService);

  ngOnInit(): void {
    const postDetailId = this.route.snapshot.params['id'];
    this.urlSahre = postDetailId;

    this.postServices.getPostById(postDetailId).subscribe((response) => {
      this.postData = response.post;
      this.userId = this.postData.user_id;
      this.post_id = this.postData._id;
      this.postServices.postIdSignal = this.post_id;
      if (this.userId) {
        this.postServices.getProfilUser(this.userId).subscribe((users: { user: User }) => {
          this.userData = users.user;
        });
      }
    });

  }

  async savePost() {
   const exist = await this.storageService.savePosts(this.postData);
   this.favoriteIcons = (exist) ? 'ri-bookmark-fill ri-xl':'ri-bookmark-line ri-xl';
  };

  async share() {
    const data = {
      title: this.postData.title,
      url: `post/${this.urlSahre}`,
    }
    await navigator.share(data)
    .then(()=>this.snakServie.alertBar('Link shared! Thank you very much'))
    .catch(()=>this.snakServie.alertBar('Oops, an error occurred'))
  };

  like() {
    console.log("Like");
  };

  coments() {
    this.comentsService.getComments(this.post_id).subscribe((response) => {
      this.comentData = response.comments;
    })
    this.showFiller = !this.showFiller;
  };

  close(newValue: boolean) {
    this.showFiller = newValue;
  }

}
