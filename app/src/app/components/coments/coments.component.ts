import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { Comment, responseData } from '../../interfaces/interface';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RegisterComponent } from '../../auth/register/register.component';
import { LoginComponent } from '../../auth/login/login.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrentDateForm } from '../../shared/clases/date-helper';
import { PostsService } from '../../services/posts.service';
import { ImagenProfilePipe } from '../../pipes/imagen-profile.pipe';

@Component({
  selector: 'app-coments',
  imports: [MatSidenavModule, MatDividerModule, CommonModule, MatDialogModule, ReactiveFormsModule, ImagenProfilePipe],
  templateUrl: './coments.component.html',
  styleUrl: './coments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComentsComponent implements OnInit {
  @Input() comentData: Partial<Comment>[] = [];
  @Input() valueClick?: any;
  @Output() valueClickClose = new EventEmitter<boolean>();

  user: Partial<responseData> = {};
  perfil: responseData | null | any = null;
  postId!: string
  isLoading = false;
  private authService: AuthService = inject(AuthService);
  readonly dialog = inject(MatDialog);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private postService: PostsService = inject(PostsService);



  ngOnInit(): void {
    this.postId = String(this.postService.postIdSignal);
    this.loadProfile();

  }

  loadProfile() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.perfil = JSON.parse(storedUser);
    }
    this.getUserData();
  }

  getUserData() {
    this.authService.getUser().then((user) => {
      this.user = user;
      this.userID?.setValue(user._id);
      this.authorID?.setValue(`${user.name}  ${user.last_name}`);
      this.authorPhoto?.setValue(user.photo);
      this.postID?.setValue(this.postId);
    }).catch((error) => {

    })
  }

  commentForm: FormGroup = this.formBuilder.group({
    post_id: ['', [Validators.required]],
    author: ['', [Validators.required]],
    author_photo: [''],
    content: ['', [Validators.required]],
    created_at: [CurrentDateForm.CurrendDateHelper(), [Validators.required]]

  });

  get userID() {
    return this.commentForm.get('user_id');
  }
  get authorID() {
    return this.commentForm.get('author');
  }
  get authorPhoto() {
    return this.commentForm.get('author_photo');
  }

  get postID() {
    return this.commentForm.get('post_id')
  }


  openDialogLogin() {
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed()
  }

  openDialogRegister() {
    const dialogRef = this.dialog.open(RegisterComponent);
    dialogRef.afterClosed()
  }

  sendComment() {
    const data = this.commentForm.value;
    if (this.commentForm.invalid) {
      return;
    }
    
    this.isLoading = !this.isLoading;
    this.postService.sendComment(data).subscribe({
      next: (resp) => {
        this.isLoading = false;
        this.comentData.unshift({...resp.comment});
        this.commentForm.reset();
        return resp.comment;
      },
      error: (error) => {
        //error
      }
    })

  }

  close(clickValue: boolean) {
    this.valueClickClose.emit(clickValue);
  }
}
