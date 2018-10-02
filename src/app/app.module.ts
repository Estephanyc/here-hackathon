import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire'; 

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { environment } from '../environments/environment';
import { FirebaseService } from "./firebase.service";

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { FormComponent } from './form/form.component';
import { HeaderComponent } from './header/header.component';
import { ModalDetailsComponent } from './modal-details/modal-details.component';
import { InputSearchComponent } from './input-search/input-search.component';
import { SplashComponent } from './splash/splash.component';
import { CategoriesComponent } from './categories/categories.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  {
    path: 'add',
    component: FormComponent,

  },
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    FormComponent,
    HeaderComponent,
    ModalDetailsComponent,
    InputSearchComponent,
    SplashComponent,
    CategoriesComponent,
    HomeComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    ReactiveFormsModule
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
