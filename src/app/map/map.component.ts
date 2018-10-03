import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';

import { MapService } from '../map.service';
import { GeoService } from '../geoFire.service';
import { FirebaseService } from '../firebase.service';
import * as firebase from 'firebase';

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
  lng: any;
  map: any;
  markers: any;
  subscription: any;
  places: any = [];
  locations: any =[]
  listActive: boolean = false

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
  }
   // Mostrar el mapa desde mi ubicación actual
  setMapCenter() {
    let defaultLayers = this.platform.createDefaultLayers();
    const self = this;
    this.map = new H.Map(
      this.mapElement.nativeElement,
      defaultLayers.normal.map,
      {
        zoom: 18,
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
    // quitar los puntos del mapa en cada consulta
    this.map.removeObjects(this.map.getObjects());

    //get locations con geofire
    this.geo.getLocations(10, [this.lat, this.lng])
    .on('key_entered', (key, location, distance) => {
      this.FirebaseService.getIndividualData(key).subscribe((place:any)=>{
        this.places.push(place)
        // marcar el punto en el mapa
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
      })       
    })
  }
  
  // marcar la ubicación actual
  markerCurrentPosition(){
    let icon = new H.map.Icon('../../assets/img/current-pos.png'),
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
  }
  activeMap() {
    console.log('activar mapa')
    this.listActive = false
  }
}
