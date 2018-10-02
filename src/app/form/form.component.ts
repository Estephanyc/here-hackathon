import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MapService } from '../map.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  dataForm: FormGroup;
  form: boolean
  addSuccessful: boolean

  constructor(private firebaseService: FirebaseService, private formBuilder: FormBuilder, private MapService: MapService)
   {
    this.createData();
   };

  ngOnInit() {
    this.form = true
  }

  createData() {
    this.dataForm = this.formBuilder.group({
      name: ['', Validators.required],
      product: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      phone: ['', Validators.required],
      website: [''],
      location: ['', Validators.required],
    });
  }

  addData() {
    // cambiar dirección a lat y lng
    let geocodingParams = {
      searchText: this.dataForm.value.location
    }
    let platform = this.MapService.platformHere()
    var geocoder = platform.getGeocodingService();

    geocoder.geocode(geocodingParams, (value) =>{
      let locations = value.Response.View[0].Result
      let lat = locations[0].Location.DisplayPosition.Latitude
      let lng = locations[0].Location.DisplayPosition.Longitude
      let object = {
        name: this.dataForm.value.name,
        product: this.dataForm.value.product,
        category: this.dataForm.value.category,
        description: this.dataForm.value.description,
        l: {
          0: lat,
          1: lng,
        },
        phone: this.dataForm.value.phone,
        website: this.dataForm.value.website,
      }
    this.firebaseService.addData(object).then((value)=>{
      this.dataForm.reset();
      this.form = false;
      console.log(this.addSuccessful)
    })
    }, function (e) {
      alert(e)
    });   
  }
}
