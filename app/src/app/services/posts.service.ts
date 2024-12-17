import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroments';
import { Comment, Post, responseDataPosts, User } from '../interfaces/interface';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private readonly URL = environment.URL;
  private http: HttpClient = inject(HttpClient);
  paginaPost = 0;


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
}
