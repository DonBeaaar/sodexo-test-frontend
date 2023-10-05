import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';
import { NewsService } from 'src/app/services/news.service';
import { StateService } from 'src/app/services/state.service';
import { News } from 'src/app/interfaces/news';
import { NewsComponent } from './news.component';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;
  let newsService: jasmine.SpyObj<NewsService>;
  let stateService: jasmine.SpyObj<StateService>;

  beforeEach(() => {
    const newsServiceSpy = jasmine.createSpyObj('NewsService', [
      'addToFavorite',
      'deleteFromFavorite',
    ]);

    const stateServiceSpy = jasmine.createSpyObj('StateService', [
      'getNewsObs',
      'getFavoriteNewsObs',
      'setNewsObs',
      'setFavoriteNewsObs',
      'getNews',
      'getFavoriteNews',
    ]);

    TestBed.configureTestingModule({
      declarations: [],
      imports: [NewsComponent,MatTableModule, MatInputModule],
      providers: [
        { provide: NewsService, useValue: newsServiceSpy },
        { provide: StateService, useValue: stateServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
    newsService = TestBed.inject(NewsService) as jasmine.SpyObj<NewsService>;
    stateService = TestBed.inject(StateService) as jasmine.SpyObj<StateService>;

    component.news = [
      { id: 1, title: 'News 1', summary: 'Summary 1', published_at: '2023-10-01', favorite: false, url: 'test', news_site: 'test' },
      { id: 2, title: 'News 2', summary: 'Summary 2', published_at: '2023-10-02', favorite: true, url: 'test', news_site: 'test' }
    ];
    component.favoriteNews = [{ id: 2, title: 'News 2', summary: 'Summary 2', published_at: '2023-10-02', favorite: true, url: 'test', news_site: 'test' }];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getNews and getFavoriteNews on ngOnInit', () => {

    stateService.getNews.and.returnValue(component.news);
    stateService.getFavoriteNews.and.returnValue(component.favoriteNews);
    stateService.getNewsObs.and.returnValue(of(component.news));
    stateService.getFavoriteNewsObs.and.returnValue(of(component.favoriteNews));

    component.ngOnInit();

    expect(stateService.getNewsObs).toHaveBeenCalled();
    expect(stateService.getFavoriteNewsObs).toHaveBeenCalled();
    expect(component.news).toEqual(component.news);
    expect(component.favoriteNews).toEqual(component.favoriteNews);
    expect(component.dataSource.data).toEqual(component.news);
  });

  it('should set favorite and call addToFavorite', () => {
    const newsToSetFavorite: News = { id: 3, title: 'News 3', summary: 'Summary 3', published_at: '2023-10-01', favorite: false, url: "test", news_site: "test" };
    const addToFavoriteResponse: News = { ...newsToSetFavorite, favorite: true };

    component.dataSource = new MatTableDataSource([newsToSetFavorite]);
    newsService.addToFavorite.and.returnValue(of(addToFavoriteResponse));
    stateService.getFavoriteNews.and.returnValue(component.favoriteNews);

    component.setFavorite(newsToSetFavorite);

    expect(newsService.addToFavorite).toHaveBeenCalledWith(newsToSetFavorite);
  });

  it('should delete favorite and call deleteFromFavorite', () => {
    const newsToDeleteFavorite: News = { id: 3, title: 'News 3', summary: 'Summary 3', published_at: '2023-10-01', favorite: true, url: "test", news_site: "test" };
    const deleteFromFavoriteResponse = {};

    component.dataSource = new MatTableDataSource([component.news[0]]);
    newsService.deleteFromFavorite.and.returnValue(of(deleteFromFavoriteResponse));
    stateService.getNews.and.returnValue(component.news);
    stateService.getFavoriteNews.and.returnValue(component.favoriteNews);

    component.setFavorite(newsToDeleteFavorite);

    expect(newsService.deleteFromFavorite).toHaveBeenCalledWith(newsToDeleteFavorite.id);
  });


  
});
