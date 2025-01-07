import { ChangeDetectorRef, Component, inject, OnInit, SimpleChanges } from '@angular/core';
import { Post, responseData, User } from '../../interfaces/interface';
import { PostsService } from '../../services/posts.service';
import { AuthService } from '../../auth/auth.service';
import { CardComponent } from '../../components/card/card.component';
import { DashboardSkeletonComponent } from '../../components/dashboard-skeleton/dashboard-skeleton.component';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalEditPerfilComponent } from '../../components/modal-edit-perfil/modal-edit-perfil.component';
import { CommonModule } from '@angular/common';
import { ImagenProfilePipe } from '../../pipes/imagen-profile.pipe';
import { RegisterComponent } from '../../auth/register/register.component';
import { MoreComponent } from '../../components/more/more.component';

@Component({
    selector: 'app-dashboard',
    imports: [CardComponent, DashboardSkeletonComponent, RouterModule, CommonModule, ImagenProfilePipe, MoreComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

    postsData: Post[] = []
    userData: Partial<User> = {};
    perfil: responseData | null | any = null;
    user: Partial<responseData> = {}
    userID: any;
    isLoading: boolean = false;


    private postsService: PostsService = inject(PostsService);
    private readonly authService: AuthService = inject(AuthService);
    readonly dialog = inject(MatDialog);
    private changeDetettor: ChangeDetectorRef = inject(ChangeDetectorRef)
    ngOnInit(): void {
        this.loadProfile();
        this.isLoading = !this.isLoading;
        this.postsService.getAllPosts(true).subscribe((resp) => {
            this.userID = this.user._id;
            const userPosts = resp.posts.filter((post) => post.user_id === this.userID);
            this.postsData = userPosts;
            this.isLoading = false

            if (this.userID) {
                this.postsService.getProfilUser(this.userID).subscribe((users: { user: User }) => {
                    this.userData = users.user;
                });
            }
        })
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
            this.changeDetettor.detectChanges();
        }).catch((error) => {

        })
    }

    getResponse(resp: Post[]) {
        return resp.map((e) => {
            this.postsData.push(e);
        })
    }

    editProfile() {
        const dialogRef = this.dialog.open(RegisterComponent);
        dialogRef.afterClosed();
    }

    addNewCreator() {
        const dialogRef = this.dialog.open(ModalEditPerfilComponent);
        dialogRef.afterClosed();
    }

    getInitials(name: string | undefined, lastName: string | undefined): string {
        const nameInitial = name ? name.charAt(0).toUpperCase() : '';
        const lastNameInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        return `${nameInitial}${lastNameInitial}`;
    }
}
