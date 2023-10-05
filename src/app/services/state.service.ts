import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { News } from '../interfaces/news';
import { NewsService } from './news.service';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  constructor(private newsService : NewsService) {}

  private news: News[] = [];
  private newsObs : BehaviorSubject<News[]> = new BehaviorSubject([] as News[]);
  private favoriteNews: News[] = [];
  private favoriteNewsObs : BehaviorSubject<News[]> = new BehaviorSubject([] as News[]);

  getNews() {
    return this.news;
  } 
  setNews(news: News[]) { 
    this.news = news;
  }

  getNewsObs () {
    if (this.getNews().length <= 0) {
      this.newsService.getNews().subscribe((news)=>{
        this.setNews(news);
        return this.setNewsObs(news);
      });
    }
    return this.newsObs.asObservable();
  }

  setNewsObs (news: News[]) {
    this.setNews(news);
    this.newsObs.next(this.getNews());
  }

  getFavoriteNews() {
    return this.favoriteNews;
  } 
  setFavoriteNews(news: News[]) { 
    this.favoriteNews = news;
  }

  getFavoriteNewsObs () {
    if (this.getFavoriteNews().length <= 0) {
      this.newsService.getNews(true).subscribe((news)=>{
        return this.setFavoriteNewsObs(news)
      });
    }
    return this.favoriteNewsObs.asObservable();
  }

  setFavoriteNewsObs (news: News[]) {
    this.setFavoriteNews(news);
    this.favoriteNewsObs.next(this.getFavoriteNews());
  }

}
