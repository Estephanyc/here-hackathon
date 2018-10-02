import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapService } from '../map.service';
import { GeoService } from '../geoFire.service';

declare var H: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private platform: any; 
  private ui: any;

  placesExamples= [
    {
      title: 'nueces de la casa',
      image: '../../assets/img/almonds.jpg',
      lat: '-33.418131',
      lng: '-70.608559'
    },
    {
      title: 'nueces de la casa',
      image: '../../assets/img/almonds.jpg',
      lat: '-33.445704',
      lng: '-70.649346'
    },
    {
      title: 'nueces de la casa',
      image: '../../assets/img/almonds.jpg',
      lat: '-33.44007',
      lng: '-70.65558'
    },
    {
      title: 'nueces de la casa',
      image: '../../assets/img/almonds.jpg',
      lat: '-33.44276',
      lng: '-70.65109'},
  ]
  @ViewChild("map")
  public mapElement: ElementRef;

  lat: any;
  lng: any;
  map: any;

  markers: any;
  subscription: any;

    constructor(private geo: GeoService, private MapService: MapService) {
      this.platform = MapService.platformHere();

   }
  ngOnInit() {
    // obtener la ubicacion actual
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.geo.getLocations(10, [this.lat, this.lng])
        this.setMapCenter();
      });
    }
    this.subscription = this.geo.hits
      .subscribe(hits => {
        console.log(hits)
        this.markers = hits
      }
      )
  }
  ngOnDestroy() {
    this.subscription.unsubscribe()
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
    this.map.removeObjects(this.map.getObjects());
    
    this.placesExamples.forEach((place)=>{
      let marker = new H.map.Marker({ "lat": place.lat, "lng": place.lng });
      marker.setData("<p>" + place.title + "<br>");
      marker.addEventListener('tap', event => {
        let bubble = new H.ui.InfoBubble(event.target.getPosition(), {
          content: event.target.getData()
        });
        this.ui.addBubble(bubble);
      }, false);
      this.map.addObject(marker);
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
  
}
