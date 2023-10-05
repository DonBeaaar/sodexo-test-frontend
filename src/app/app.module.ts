import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewsComponent } from './components/news/news.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FavoritesComponent } from './screens/favorites/favorites.component';
import { HomeComponent } from './screens/home/home.component';
import { StoreModule } from '@ngrx/store';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    FavoritesComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NewsComponent,
    BrowserAnimationsModule,
    StoreModule.forRoot({}, {}),
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
