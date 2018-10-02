import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(private database:AngularFireDatabase) { }
  addData(object){
    this.database.list('locationCaro').push(object)
  }
}
