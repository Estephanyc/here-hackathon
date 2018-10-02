import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { GeoService } from './geoFire.service';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  constructor(private database:AngularFireDatabase, private geo: GeoService) { }
  addData(object){
     return this.database.list('items').push(object).then((value)=>{
      console.log('hola')
      let coords = [object.l[0], object.l[1]]
      this.geo.setLocation(value.key,coords)
    })
  }
  getIndividualData(){
    // return this.database.object().valueChanges();
  }
}
