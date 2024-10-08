import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { CarrucelData, User } from '../../interfaces/interface';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PostsService } from '../../services/posts.service';



@Component({
  selector: 'app-carrucel',
  standalone: true,
  imports: [CommonModule, CustomDatePipe, RouterModule],
  templateUrl: './carrucel.component.html',
  styleUrl: './carrucel.component.scss'
})
export class CarrucelComponent implements OnInit {

  @Input() slideData2!: CarrucelData[];
  currentIndex: number = 0;
  userId!:number;
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
