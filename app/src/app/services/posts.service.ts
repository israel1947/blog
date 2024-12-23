import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroments';
import { Comment, Post, PostRequest, responseDataPosts, User } from '../interfaces/interface';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../auth/auth.service';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private readonly URL = environment.URL;
  private http: HttpClient = inject(HttpClient);
  private auth: AuthService = inject(AuthService);
  paginaPost = 0;
  newPost = new EventEmitter<PostRequest>();


  getProfilUser(post_id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.URL}/users?id=${post_id}`);
  };

  getAllPosts(pull: boolean = false): Observable<responseDataPosts> {
    if (pull) {//get page 1 when refresh page and new posts are loaded
      this.paginaPost = 0;
    }
    this.paginaPost++;
    return this.http.get<responseDataPosts>(`${this.URL}/posts?page=${this.paginaPost}`);
  };

  getPostById(id: string): Observable<{ ok: boolean, post: Post }> {
    return this.http.get<{ ok: boolean, post: Post }>(`${this.URL}/posts/${id}`);
  };

  getComments(post_id: string): Observable<{ ok: boolean, comments: Partial<Comment>[] }> {
    return this.http.get<{ ok: boolean, comments: Partial<Comment>[] }>(`${this.URL}/comments/comment?post_id=${post_id}`);
  };

  getPostByCategory(category: string): Observable<{ ok: boolean, posts: Post[] }> {
    const encodedCategory = encodeURIComponent(category);
    return this.http.get<{ ok: boolean, posts: Post[] }>(`${this.URL}/posts?category=${encodedCategory}`);
  };

  createPosts(postData: FormData): Observable<{ post: PostRequest }> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth.token ? this.auth.token.replace(/"/g, '') : ''}`
    });

    return this.http.post<{ post: PostRequest }>(`${this.URL}/posts/create`, postData, { headers }).pipe(
      tap(response => {
        this.newPost.emit(response.post);
      }),
      catchError(error => {
        console.log('error al crear posts:', error);
        return throwError(() => new Error('Error al crear el post. Por favor, inténtalo de nuevo.'))

      })
    );

  }

}
