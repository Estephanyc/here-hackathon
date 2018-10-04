import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';

import { MapService } from '../map.service';
import { GeoService } from '../geoFire.service';
import { FirebaseService } from '../firebase.service';
import * as firebase from 'firebase';
import { BrowserModule } from '@angular/platform-browser';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';

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
  radio : number = 15;

  constructor(private bottomSheet: MatBottomSheet, private geo: GeoService, private MapService: MapService, private FirebaseService: FirebaseService) {
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
  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent);
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
    this.geo.getLocations(this.radio, [this.lat, this.lng])
    .on('key_entered', (key, location, distance) => {
      this.FirebaseService.getIndividualData(key).subscribe((place:any)=>{
        place['distance'] = Math.trunc(distance);
        place['key'] = key; 
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
   
    marker.setData(place.name);
    const self = this;
    console.log(place)
    marker.addEventListener('tap', function():void{
      self.bottomSheet.open(BottomSheetComponent, {
        data: { place: place }});
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
  nearbyPlaces(){
    this.radio = 5;
    this.showPlaces();
    this.listActive = true;
    this.showCategories = false
    this.markerCurrentPosition();

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
    this.radio = 15;
    this.category = cat
    this.showPlaces()
    this.listActive =true
    this.showCategories =false
  }
  routing(point1){
    this.listActive =false;
     
    console.log(point1)
    console.log(this.lat + ' ' +this.lng)
    let self = this
    var routingParameters = {
      // The routing mode:
      'mode': 'fastest;car',
      // The start point of the route:
      'waypoint0': `geo!${this.lat},${this.lng}`,
      // The end point of the route:
      'waypoint1': `geo!${point1[0]},${point1[1]}`,
      // To retrieve the shape of the route we choose the route
      // representation mode 'display'
      'representation': 'display'
    };
    
    var onResult = function (result) {
      var route,
        routeShape,
        startPoint,
        endPoint,
        linestring;
      if (result.response.route) {
        // Pick the first route from the response:
        route = result.response.route[0];
        // Pick the route's shape:
        routeShape = route.shape;

        // Create a linestring to use as a point source for the route line
        linestring = new H.geo.LineString();

        // Push all the points in the shape into the linestring:
        routeShape.forEach(function (point) {
          var parts = point.split(',');
          linestring.pushLatLngAlt(parts[0], parts[1]);
        });

        // Retrieve the mapped positions of the requested waypoints:
        startPoint = route.waypoint[0].mappedPosition;
        endPoint = route.waypoint[1].mappedPosition;

        // Create a polyline to display the route:
        var routeLine = new H.map.Polyline(linestring, {
          style: { strokeColor: 'blue', lineWidth: 4 }
        });

        // Create a marker for the start point:
        var startMarker = new H.map.Marker({
          lat: startPoint.latitude,
          lng: startPoint.longitude
        });

        // Create a marker for the end point:
        var endMarker = new H.map.Marker({
          lat: endPoint.latitude,
          lng: endPoint.longitude
        });

        // Add the route polyline and the two markers to the map:
        self.map.addObjects([routeLine, startMarker, endMarker]);

        // Set the map's viewport to make the whole route visible:
        self.map.setViewBounds(routeLine.getBounds());
      }
    }
    // Get an instance of the routing service:
    var router = this.MapService.platformHere().getRoutingService();
    router.calculateRoute(routingParameters, onResult,
      function (error) {
        alert(error.message);
      });
  }
}
  
