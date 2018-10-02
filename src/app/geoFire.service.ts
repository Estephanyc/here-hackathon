import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { GeoFire } from 'geofire';

import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class GeoService {
  
  dbRef: any;
  geoFire: any;
  hits = new BehaviorSubject([])
 

  constructor(private db: AngularFireDatabase) {
    this.dbRef = this.db.list('/locations');
    this.geoFire = new GeoFire(this.dbRef.query.ref);
   }

  getLocations(radius: number, coords: Array<number>) {
    this.geoFire.query({
      center: coords,
      radius: radius
    })
      .on('key_entered', (key, location, distance) => {
        let hit = {
          location: location,
          distance: distance,
          key: key
        }
        let currentHits = this.hits.value
        currentHits.push(hit)
        this.hits.next(currentHits)
      })
  }
  /* private seedDatabase() {
    let dummyPoints = [
      [-33.445704, -70.649346],
      [-33.445704, -70.649346],
      [-33.445704, -70.649346],
      [-33.445704, -70.649346],
      [-33.445704, -70.649346],
    ]

    dummyPoints.forEach((val, idx) => {
      let name = `news-locations-${idx}`
      console.log(idx)
      this.setLocation(name, val)
    })
  } */
  setLocation(key: string, coords: Array<number>) {
    this.geoFire.set(key, coords)
      .then(_ => console.log('location updated'))
      .catch(err => console.log(err))
  }
}