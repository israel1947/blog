import { Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CarrucelData, Post } from '../../interfaces/interface';
import { PostsService } from '../../services/posts.service';
import { CardComponent } from "../../components/card/card.component";
import { CarrucelComponent } from "../../components/carrucel/carrucel.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { DateUtils } from '../../shared/clases/date-helper';
import { CategoryComponent } from "../category/category.component";
import { RouterModule } from '@angular/router';
import { SkeletonComponent } from "../../shared/skeleton/skeleton.component";

@Component({
    selector: 'app-home',
    imports: [MatTabsModule, CardComponent, CarrucelComponent, MatProgressSpinnerModule, MatDividerModule, CategoryComponent, RouterModule, SkeletonComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  @ViewChild('cont2r') content!: ElementRef;
  @ViewChild('slide') slide!: ElementRef;

  /* Services */
  private readonly postsServices: PostsService = inject(PostsService);
  private readonly render: Renderer2 = inject(Renderer2);


  listItems = ['All', 'Negocios', 'Tecnología', 'test categoria', 'Cultura', 'Salud', 'Cocina', 'Finanzas', 'Desarrollo Personal', 'Educación'];
  posts: Post[] = [];
  slideData: CarrucelData[] = [];
  clasTypeCard: string[] = ['container--card', 'flex', 'items-center', 'justify-center', 'gap-[10px]', 'cursor-pointer'];
  clasType2Card: string[] = ['container--card', 'flex', 'items-center', 'justify-center', 'gap-[10px]', 'flex-col', 'cursor-pointer'];
  pba: boolean = false;
  isLoading: boolean = false;
  mostViews: Partial<Post>[] = [];
  WeeklyHighlight: Post[] = [];
  latesNews: Post[] = [];
  tabName: string = 'All';

  category!:string;
  postsByCategory:Post[] = [];
  carrucelCategory:CarrucelData[] = [];
  latesNewsCategory: Post[] = [];


  ngOnInit(): void {
    this.allPosts(true);
  }



  allPosts(pull?: boolean) {
    this.isLoading = !this.isLoading;
    this.postsServices.getAllPosts(pull).subscribe((post) => {
      this.postsFun(post.posts);
      this.posts = post.posts;
      this.posts = post.posts
      this.latesNews = this.getLatesNews(post.posts);
      this.mostViews = this.getMostViews(post.posts);
      this.WeeklyHighlight = this.getWeeklyHighlight(post.posts);
      this.isLoading = false;
    });

  };

  getMostViews(mostViewsD: Array<Post>) {
    return mostViewsD.filter((views) => views.views >= 150)
  };


  getLatesNews(postsLN: Array<Post>) {
    return postsLN.filter((lates) => {
      return DateUtils.MostRecently(30, lates.created_at);
    });
  }

  getWeeklyHighlight(weeklyData: Array<Post>) {
    return weeklyData.filter((lates) => {
      return DateUtils.MostRecently(7, lates.created_at);
    });
  }

  tabNav(tabValue: number) {
    const selectedTab = this.listItems[tabValue];
    this.tabName = selectedTab;
    this.category = selectedTab;
    this.getPostByCategory(selectedTab);
  };

  getPostByCategory(category: string) {
    try {
       if (category === 'All') {
        this.allPosts(true);
        return
      }; 

      this.isLoading = !this.isLoading;
      this.postsServices.getPostByCategory(category).subscribe((resp) => {
        let categoryTab!: string;
        const categoryFilter = resp.posts.filter((cate) => cate.category === category)
        categoryTab = categoryFilter.map((e) => e.category).toString();

        if (categoryFilter.length > 0) {
          this.postsByCategory = categoryFilter;
          this.postsFun(categoryFilter);
          if (category === categoryTab) {
            this.pba = !this.pba;
            
           /*  this.WeeklyHighlight = categoryFilter.filter((lates) => {
              return DateUtils.MostRecently(7, lates.created_at);
            }); */
            
            this.latesNews = categoryFilter.filter((lates) => {
              return DateUtils.MostRecently(30, lates.created_at);
            });
            this.latesNewsCategory =  this.latesNews;            

            /* this.mostViews = categoryFilter.filter((views) => views.views >= 150);
            this.isLoading = false; */
          }
        } else {
          this.posts = [];
          this.mostViews = [];
          this.WeeklyHighlight = [];
          this.latesNews = [];
        }
        this.isLoading = false;
      });
    } catch (error) {

    };
  };

  postsFun(resp: CarrucelData[] | any) {
    this.posts = resp;
    if (resp.length > 1) {
      this.slideData = resp.slice(0, -6);
    }
    this.carrucelCategory = resp/* .slice(0, -6) */;
  };
}
