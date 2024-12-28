import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { CarrucelData } from '../../interfaces/interface';
import { RouterModule } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { ImagenPipe } from '../../pipes/imagen.pipe';



@Component({
    selector: 'app-carrucel',
    imports: [CommonModule, RouterModule, ImagenPipe],
    templateUrl: './carrucel.component.html',
    styleUrl: './carrucel.component.scss'
})
export class CarrucelComponent implements OnInit {

  @Input() slideData2!: CarrucelData[];
  currentIndex: number = 0;
  userId!: number;
  private postServices: PostsService = inject(PostsService);

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    if (this.slideData2.length > 0) {
      this.slideData2.forEach((post) => {
        this.userId = post.user_id
        this.postServices.getProfilUser(this.userId).subscribe((data: any) => {
          post.author = data[0]
        });
      });
    }
  }

  getExcerptWithHTML(content: any, limit: number): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    return tempDiv.textContent?.substring(0, limit) + '...' || '';
  }
  


  nextBtn(slide: any, i: number) {
    if (i <= 0) {
      const restarCarrucel = i.toString;
      this.nextBtn(slide, restarCarrucel.length + 1);
    }
    this.currentIndex = i + 1;
  };

  prevBnt(slide: any, i: number) {
    if (i <= 0) {
      const restarCarrucel = i.toString;
      this.nextBtn(slide, restarCarrucel.length + 1);
    }
    this.currentIndex = i - 1;
  };
}
