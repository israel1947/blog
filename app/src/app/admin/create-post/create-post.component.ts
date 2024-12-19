import { Component, inject, OnInit } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { Category, responseData } from '../../interfaces/interface';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { FileUtils } from '../../shared/clases/file-helper';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [MatChipsModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {
  tagsArray: string[] = [];
  categorySelect = Object.values(Category);
  currentDate = new Date();
  perfil: responseData | null | any = null;
  user: Partial<responseData> = {}
  fieldsPost = ['title', 'images', 'description', 'tags', 'created_at', 'last_read_at', 'category', 'user_id']
  previewImgCover = FileUtils.previewImage;

  fileSelected = FileUtils.onFileSelected;

  private formBilder: FormBuilder = inject(FormBuilder);
  private readonly authService: AuthService = inject(AuthService);

  constructor() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.perfil = JSON.parse(storedUser);
    }
    this.getUserData();
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

  get userID() {
    return this.postForm.get('user_id');
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


  onFileSelectedPreview(event:Event){
    FileUtils.onFileSelected(event, this.postForm, 'images', (preview) => {
      this.previewImgCover = preview;
    });
    console.log(this.previewImgCover);
  }

  async publish() {
    const { tags, created_at, category, user_id, title, description, last_read_at, images } = this.postForm.value;
    console.log({ tags, created_at, category, user_id, title, description, last_read_at, images });

    FileUtils.loadFileSelected('images', this.postForm, this.fieldsPost);
  }
}