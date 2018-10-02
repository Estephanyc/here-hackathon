import { Injectable } from '@angular/core';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class GeocoderService {
  public geocoder: any;
  private platform: any; 

  constructor(private MapService: MapService) 
  {
//     this.platform = MapService.platformHere();
//     this.geocoder = this.platform.getGeocodingService(); }
//   public getAddress(query: string) {
//     return new Promise((resolve, reject) => {
//         this.geocoder.geocode({ searchText: query }, result => {
//             if(result.Response.View.length > 0) {
//                 if(result.Response.View[0].Result.length > 0) {
//                     resolve(result.Response.View[0].Result);
//                 } else {
//                     reject({ message: "no results found" });
//                 }
//             } else {
//                 reject({ message: "no results found" });
//             }
//         }, error => {
//             reject(error);
//         });
//     });
// }
}
}