import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';

import { MapService } from '../map.service';
import { GeoService } from '../geoFire.service';
import { FirebaseService } from '../firebase.service';
import * as firebase from 'firebase';
import { BrowserModule } from '@angular/platform-browser';

declare var H: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private platform: any; 
  private ui: any;

  @ViewChild("map")
  public mapElement: ElementRef;

  lat: any;
  category: string = 'todos'
  lng: any;
  showCategories : boolean = true
  map: any;
  markers: any;
  subscription: any;
  places: any = [];
  locations: any =[]
  listActive: boolean = false;
  mapHeight: any = '100%'

  constructor(private geo: GeoService, private MapService: MapService, private FirebaseService: FirebaseService) {
      this.platform = this.MapService.platformHere()
   }
  
  ngOnInit() {
    // obtener la ubicacion actual
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.setMapCenter();
      });
    }
    console.log(this.mapHeight)
  }
   // Mostrar el mapa desde mi ubicación actual
  setMapCenter() {
    let defaultLayers = this.platform.createDefaultLayers();
    const self = this;
    this.map = new H.Map(
      this.mapElement.nativeElement,
      defaultLayers.normal.map,
      {
        zoom: 12,
        center: { lat: self.lat, lng: self.lng }
      }
    );
    this.showPlaces()
    this.markerCurrentPosition();
    let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    this.ui = H.ui.UI.createDefault(this.map, defaultLayers);
  }
 
  // Mostrar los marcadores en el mapa
  showPlaces() {
    this.places = []
    // quitar los puntos del mapa en cada consulta
    this.map.removeObjects(this.map.getObjects());

    //get locations con geofire
    this.geo.getLocations(4, [this.lat, this.lng])
    .on('key_entered', (key, location, distance) => {
      this.FirebaseService.getIndividualData(key).subscribe((place:any)=>{
        place['distance'] = Math.trunc(distance); 
        if(this.category == 'todos'){
          this.places.push(place)
          this.addMarker(place)
        }
        if(place.category == this.category){
          this.places.push(place)
          this.addMarker(place)
        }
        console.log(place)
        // marcar el punto en el mapa
      })       
    })
  }
  addMarker(place){
    let icon = new H.map.Icon('../../assets/img/marck-places.png');
    let marker = new H.map.Marker({ "lat": place.l[0], "lng": place.l[1] }, {
      icon: icon
    });
    marker.setData("hola");
    marker.addEventListener('tap', event => {
      console.log(event)
      let bubble = new H.ui.InfoBubble(event.target.getPosition(), {
        content: event.target.getData()
      });
      this.ui.addBubble(bubble);
    }, false);
    this.map.addObject(marker); 
  }
  // marcar la ubicación actual
  markerCurrentPosition(){
    console.log('marcar la actual')
    let icon = new H.map.Icon('../../assets/img/current-location.png'),
      coords = {
        lat: this.lat,
        lng: this.lng
      },
      marker = new H.map.Marker(coords, {
        icon: icon
      });
    this.map.addObject(marker);
  }
  activeList() {
    this.listActive = true
    this.showCategories = false
  }
  activeMap() {
    console.log('activar mapa')
    this.listActive = false
  }
  changeCat(cat){
    this.category = cat
    this.showPlaces()
    this.listActive =true
    this.showCategories =false
  }
}
