import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Post } from '../../interfaces/interface';
import { CommonModule } from '@angular/common';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { PostsService } from '../../services/posts.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { SnackbarService } from '../../shared/snackbar.service';


@Component({
  selector: 'app-card',
  imports: [CommonModule, CustomDatePipe, RouterModule, MatDividerModule, ImagenPipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() post: Partial<Post> = {};
  @Input() classType!: string[];
  @Input() cardType: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input() cardAction: 'delete' | 'normal' = 'normal';

  deletePosr:boolean = false;

  readonly dialog = inject(MatDialog);
  private postsService: PostsService = inject(PostsService);


  delete() {
    this.dialog.open(DialogComponent, {
      data: {
        title: "Remove Post",
        icon: "ri-alert-line ri-6x text-red-500",
        classCustom: "flex items-center justify-center gap-8 flex-col h-[200px]",
        contextClass: "w-[60%] text-center",
        message: `Are you sure you want to delete this post? This action cannot be undone.`,
        buttonAcept: "Yes, Delete Post",
        buttonCancel: "Cancel",
        titlePost:this.post.title
      }
    }).afterClosed().subscribe(async (close: boolean) => {
      this.deletePosr = !this.deletePosr;
      if (close) {
        this.postsService.deletePost(String(this.post._id));
      }
    })
  }
}