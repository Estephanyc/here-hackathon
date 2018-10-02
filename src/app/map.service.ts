import { Injectable } from '@angular/core';
declare var H: any;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private platform: any;

  constructor() { 
    this.platform = new H.service.Platform({
      'app_id': 'kJzLI3QUz7wY7HzWlvfn',
      'app_code': 'nCE14hAI-AFCRB472VQmCQ'
    });
    console.log(this.platform)  
  }
  platformHere() {
    console.log(this.platform)
    return this.platform
  }
}
