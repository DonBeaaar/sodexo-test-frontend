import { TestBed } from '@angular/core/testing';

import { NewsService } from './news.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { News } from '../interfaces/news';
import { environment } from 'src/environment/environment.testing';

describe('NewsService', () => {
  let service: NewsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NewsService, { provide: environment, useValue: environment }],
    });
    service = TestBed.inject(NewsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });



  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get news from API', () => {
    const mockNewsResponse = {
      results: [
        { id: 1, title: 'News 1', summary: 'Summary 1', published_at: '28 Sep 2023', favorite: false, url: 'test', news_site: 'test' },
        { id: 2, title: 'News 2', summary: 'Summary 2', published_at: '28 Sep 2023', favorite: true, url: 'test', news_site: 'test' }
      ]
      
  };


    service.getNews(false).subscribe((news) => {
      expect(news).toEqual(mockNewsResponse.results);
    });

    const req = httpTestingController.expectOne(`${environment.apiNewsUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockNewsResponse);
    
  });

  it('should add news to favorites', () => {
    const newsToAdd: News = { id: 3, title: 'News 3', summary: 'Summary 3', published_at: '2023-10-03', favorite: false, url: 'test', news_site: 'test' };

    service.addToFavorite(newsToAdd).subscribe((addedNews) => {
      expect(addedNews).toEqual(newsToAdd);
    });
    const req = httpTestingController.expectOne(`${environment.apiLocalUrl}`);
    expect(req.request.method).toBe('POST');
    req.flush(newsToAdd);

  });

  it('should delete news from favorites', () => {
    const newsIdToDelete = 2;

    service.deleteFromFavorite(newsIdToDelete).subscribe(() => {
      expect().nothing();
    });

    const req = httpTestingController.expectOne(`${environment.apiLocalUrl}/${newsIdToDelete}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should map response results', () => {
    const mockResponse = { results: [{ id: 1, title: 'News 1' }], otherData: 'other' };

    const mappedResults = service.mapResponseResults(mockResponse, false);
    expect(mappedResults).toEqual(mockResponse.results);
  });
});
