import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { FormComponent } from './form/form.component';
import { HeaderComponent } from './header/header.component';
import { ModalDetailsComponent } from './modal-details/modal-details.component';
import { InputSearchComponent } from './input-search/input-search.component';
import { SplashComponent } from './splash/splash.component';
import { CategoriesComponent } from './categories/categories.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    FormComponent,
    HeaderComponent,
    AngularFireModule,
    AngularFireDatabaseModule,
    ModalDetailsComponent,
    InputSearchComponent,
    SplashComponent,
    CategoriesComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
