import { AfterViewInit, Component, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { Category, responseData } from '../../interfaces/interface';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { FileUtils } from '../../shared/clases/file-helper';
import Quill from 'quill';
import "quill/dist/quill.core.css";
import { PostsService } from '../../services/posts.service';
import { SnackbarService } from '../../shared/snackbar.service';
import { LoadingPencilComponent } from '../../components/loading-pencil/loading-pencil.component';

@Component({
  selector: 'app-create-post',
  imports: [MatChipsModule, FormsModule, ReactiveFormsModule, LoadingPencilComponent, CommonModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent implements AfterViewInit {
  tagsArray: string[] = [];
  categorySelect = Object.values(Category);
  currentDate = new Date();
  perfil: responseData | null | any = null;
  user: Partial<responseData> = {}
  fieldsPost: Array<string> = ['title', 'images', 'description', 'tags', 'created_at', 'last_read_at', 'category', 'user_id']
  previewImgCover = FileUtils.previewImage;
  isLoading = false;
  editor!: Quill;
  savedContent: string | null = null;
  fileSelected = FileUtils.onFileSelected;

  private formBilder: FormBuilder = inject(FormBuilder);
  private readonly authService: AuthService = inject(AuthService);
  private postService: PostsService = inject(PostsService);
  private snackBarService: SnackbarService = inject(SnackbarService);

  constructor() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.perfil = JSON.parse(storedUser);
    }
    this.getUserData();
  }

  ngAfterViewInit() {
    const quill = Quill;
    this.editor = new quill('#editor-container', {
      theme: 'snow',
      placeholder: 'Write your posts content here...',
      modules: {
        syntax: true,
        toolbar: [
          ['bold', 'italic', 'underline', 'blockquote', { 'code-block': 'javascript' }], // Negrita, cursiva, subrayado
          [{ 'header': [1, 2, 3, false] }], // Encabezados
          [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Listas
          ['link', 'image'], // Enlaces, imágenes
          ['clean'], // Limpiar formateo
        ]
      }
    });
  }

  async getUserData() {
    this.user = await this.authService.getUser();
    this.userID?.setValue(this.user._id)
  }

  postForm: FormGroup = this.formBilder.group({
    title: ['', [Validators.required]],
    images: [[null], [Validators.required]],
    description: ['', [Validators.required]],
    tags: this.formBilder.array([], Validators.required),
    created_at: [this.currentDate.toISOString().split('T')[0], [Validators.required]],
    last_read_at: ['', [Validators.required]],
    category: ['', [Validators.required]],
    user_id: ['', Validators.required]

  });

  get tags(): FormArray {
    return this.postForm.get('tags') as FormArray;
  }

  addTag(tag: string) {
    this.tags.push(this.formBilder.control(tag));
  }

  get userID() {
    return this.postForm.get('user_id');
  }

  get contentPost() {
    return this.postForm.get('description');
  }

  onTagsInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    if (value.includes(',')) {
      // Dividir el valor por comas
      const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
      // Agregar nuevas etiquetas evitando duplicados
      tags.forEach(tag => {
        if (tag && !this.tagsArray.includes(tag)) {
          this.tagsArray.push(tag);
          this.tags.push(this.formBilder.control(tag))
        }
      });
      input.value = ''; // Limpiar el input después de procesar
    }
  }

  removeTag(tag: string): void {
    this.tagsArray = this.tagsArray.filter(t => t !== tag); // Eliminar etiqueta del array
  }


  onFileSelectedPreview(event: Event) {
    FileUtils.onFileSelected(event, this.postForm, 'images', (preview) => {
      this.previewImgCover = preview;
    });
    console.log(this.previewImgCover);
  }

  publish() {
    if (!this.editor || !this.editor.root) {
      return;
    }
    this.savedContent = this.editor.root.innerHTML; // Obtener el HTML del contenido
    this.contentPost?.setValue(this.savedContent)
    const { tags } = this.postForm.value;
    this.addTag(tags)

    const formData = FileUtils.loadFileSelected('images', this.postForm, this.fieldsPost);
    this.isLoading = !this.isLoading;
    this.postService.createPosts(formData)
      .subscribe({
        next: (post) => {
          this.isLoading = false;
          this.snackBarService.alertBar('Post created sussefully!', 'Aceptar');
          console.log(post.post.tags);

          return post.post;
        },
        error: (error) => {
          //
        }
      })
  }
}