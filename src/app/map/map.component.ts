import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare var H: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private platform: any; 
  public query: string;
  private ui: any;
  private search: any;


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

  constructor() {
    this.platform = new H.service.Platform({
      'app_id': 'kJzLI3QUz7wY7HzWlvfn',
      'app_code': 'nCE14hAI-AFCRB472VQmCQ'
    });
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
    this.query = "starbucks";
    this.search = new H.places.Search(this.platform.getPlacesService());
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
  // Mostrar los lugares en el mapa
  showPlaces() {
    this.map.removeObjects(this.map.getObjects());
      for (let i = 0; i < this.placesExamples.length; i++) {
        console.log(this.placesExamples[i])
        this.dropMarker({ "lat": this.placesExamples[i].lat, "lng": this.placesExamples[i].lng }, this.placesExamples[i]);
      }
  }

  // Mostrar los marcadores en el mapa
  private dropMarker(coordinates: any, data: any) {
    let marker = new H.map.Marker(coordinates);
    marker.setData("<p>" + data.title + "<br>");
    marker.addEventListener('tap', event => {
      let bubble = new H.ui.InfoBubble(event.target.getPosition(), {
        content: event.target.getData()
      });
      this.ui.addBubble(bubble);
    }, false);
    this.map.addObject(marker);
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
