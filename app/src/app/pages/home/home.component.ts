import { Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CarrucelData, Post, User } from '../../interfaces/interface';
import { PostsService } from '../../services/posts.service';
import { CardComponent } from "../../components/card/card.component";
import { CommonModule } from '@angular/common';
import { CarrucelComponent } from "../../components/carrucel/carrucel.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatTabsModule, CardComponent, CarrucelComponent, MatProgressSpinnerModule,MatDividerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  @ViewChild('cont2r') content!: ElementRef;
  @ViewChild('slide') slide!: ElementRef;

  /* Services */
  private readonly postsServices:PostsService = inject(PostsService);
  private readonly render:Renderer2 = inject(Renderer2);


  listItems = ['All', 'Negocios', 'Tecnología', 'Arte', 'Cultura', 'Salud', 'Cocina', 'Finanzas', 'Desarrollo Personal', 'Educación'];
  posts: any[] = [];
  slideData: CarrucelData[] = [];
  clasTypeCard: string[] = ['container--card', 'flex', 'items-center', 'justify-center', 'gap-[10px]', 'cursor-pointer'];
  clasType2Card: string[] = ['container--card', 'flex', 'items-center', 'justify-center', 'gap-[10px]', 'flex-col', 'cursor-pointer'];
  pba: boolean = false;
  isLoading: boolean = false;
  mostViews: Post[] = [];
  WeeklyHighlight: Post[] = [];
  latesNews: Post[] = [];

  ngOnInit(): void {
    this.allPosts();
    this.getMostViews();
    this.getWeeklyHighlight();
    this.getlatesNews();
  }

  allPosts() {
    this.postsServices.getAllPosts().subscribe((resp) => {
      this.postsFun(resp);
    });
  };

  getMostViews() {
    this.postsServices.getAllPosts().subscribe((resp: Post[]) => {
      const ba = resp.map((e) => { return e });
      this.mostViews = ba.filter((views) => views.views >= 150);
    });
  };

  getlatesNews() {
    this.postsServices.getAllPosts().subscribe((resp: Post[]) => {
      const ba = resp.map((e) => { return e });
      this.latesNews = ba.filter((lates) => {
        return this.MostRecently(30,lates.created_at);
      });
    });
  }

  getWeeklyHighlight() {
    this.postsServices.getAllPosts().subscribe((resp: Post[]) => {
      const ba = resp.map((e) => { return e });
      this.WeeklyHighlight = ba.filter((lates) => {
        return this.MostRecently(7,lates.created_at);
      });
    });
  }

  tabNav(tabValue: number) {
    const selectedTab = this.listItems[tabValue];
    this.getPostByCategory(selectedTab);
  };

  getPostByCategory(category: string) {
    try {
      if (category == 'All') {
        this.postsServices.getPostByCategory(category = '').subscribe((resp) => {
          this.postsFun(resp);
          if (this.pba) {
            this.render.removeClass(this.content.nativeElement, "colum");
            this.render.addClass(this.content.nativeElement, "container--cards");
            this.render.addClass(this.slide.nativeElement, "slideStyle");
            this.render.removeClass(this.slide.nativeElement, "slideStyleCol");
          }
        });
      };
      this.isLoading = !this.isLoading;
      this.postsServices.getPostByCategory(category).subscribe((resp:Post[]) => {
        this.postsFun(resp);
        this.pba = !this.pba;
        const ba = resp.map((e) => { return e });

        this.WeeklyHighlight = ba.filter((lates) => {
          return this.MostRecently(7,lates.created_at);
        });

        this.latesNews = ba.filter((lates) => {
          return this.MostRecently(30,lates.created_at);
        });

        this.mostViews = ba.filter((views) => views.views >= 150);

        if (this.pba) {
          this.render.removeClass(this.content.nativeElement, "container--cards");
          this.render.addClass(this.content.nativeElement, "colum");
          this.render.removeClass(this.slide.nativeElement, "slideStyle");
        }
        this.isLoading = false;
      });
    } catch (error) {

    };
  };

  postsFun(resp: any) {
    this.posts = resp;
    this.slideData = resp.slice(-5);
  };

  MostRecently(days:number, values_filter:any){
    const date = new Date();
    const diferentLates = date.getTime() - new Date(values_filter).getTime();
    const diffInMinutes = Math.floor(diferentLates / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    return diffInDays <= days;
  }
}
