import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { News, ResponseApi } from '../interfaces/news';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private http: HttpClient) {}

  getNews(favorite: boolean = false) {
    const newsUrl = favorite ? environment.apiLocalUrl : environment.apiNewsUrl;
    return this.http.get(`${newsUrl}`).pipe(
      map((response: ResponseApi | any) => {
        const datePipe = new DatePipe('en-US');
        const dataParsedDate = this.mapResponseResults(response, favorite).map(
          (news: News) => ({
            ...news,
            published_at: datePipe.transform(
              new Date(news.published_at),
              'dd MMM yyyy'
            )
          })
        );
        return dataParsedDate;
      }),
      catchError((_) => of([]))
    );
  }

  addToFavorite(news: News): Observable<News> {
    return this.http.post<News>(environment.apiLocalUrl, news);
  }

  deleteFromFavorite(id: number) {
    return this.http.delete(`${environment.apiLocalUrl}/${id}`);
  }

  mapResponseResults(response: any, favorite: boolean) {
    return favorite ? response : response.results;
  }
}
