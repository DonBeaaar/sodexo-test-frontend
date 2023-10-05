import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NewsService } from 'src/app/services/news.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { News } from 'src/app/interfaces/news';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonToggleModule,
  ],
})
export class NewsComponent implements OnInit {
  displayedColumns: string[] = ['title', 'summary', 'published_at', 'actions'];
  dataSource: MatTableDataSource<News>;

  news: News[] = [];
  favoriteNews: News[] = [];

  // @Input() news : News[];
  @Input() favorites: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private newsService: NewsService,
    private stateService: StateService
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.news);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getNews();
    if (
      !this.favorites &&
      this.stateService.getNews().length > 0 &&
      this.stateService.getFavoriteNews().length > 0
    ) {
      this.dataSource.data = this.stateService
        .getNews()
        .map((news) => ({
          ...news,
          favorite: this.stateService
            .getFavoriteNews()
            .find((favoriteNew) => news.id === favoriteNew.id)
            ? true
            : false,
        }));
    }
  }

  getNews() {
    this.stateService.getNewsObs().subscribe((news) => {
      this.news = news;
      if (!this.favorites) this.dataSource.data = this.news;
    });

    this.stateService.getFavoriteNewsObs().subscribe((favoriteNews) => {
      this.favoriteNews = favoriteNews;
      if (this.favorites) this.dataSource.data = this.favoriteNews;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setFavorite(newSelected: News) {
    if (newSelected.favorite) {
      this.deleteFromFavorite(newSelected);
    } else {
      this.addToFavorite(newSelected)
    }
  }
  
  addToFavorite (newSelected: News) {
    this.newsService
    .addToFavorite(newSelected)
    .subscribe((addedNew: News) => {
      addedNew.favorite = true;
      const indexToUpdate = this.dataSource.data.findIndex(
        (data: any) => data.id === addedNew.id
      );
      this.dataSource.data[indexToUpdate].favorite =
        !this.dataSource.data[indexToUpdate].favorite;
      this.stateService.setFavoriteNewsObs([
        ...this.stateService.getFavoriteNews(),
        addedNew,
      ]);
    });
  }
  deleteFromFavorite(newSelected: News) {
    this.newsService.deleteFromFavorite(newSelected.id).subscribe((_) => {
      const favoritesList = this.stateService
        .getFavoriteNews()
        .filter((news) => news.id !== newSelected.id);
      const cleanList = this.stateService
        .getNews()
        .map((news) =>
          news.id === newSelected.id
            ? { ...newSelected, favorite: false }
            : news
        );
      if (this.favorites) this.dataSource.data = favoritesList;

      this.stateService.setNewsObs(cleanList);
      this.stateService.setFavoriteNewsObs(favoritesList);
    });
  }
}
