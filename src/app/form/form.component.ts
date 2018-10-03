import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MapService } from '../map.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  dataForm: FormGroup;
  image: any;
  currentUploadProgress:number = -1;
  form: boolean
  addSuccessful: boolean

  constructor(private firebaseService: FirebaseService, private formBuilder: FormBuilder,private storage: AngularFireStorage,  private MapService: MapService)
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
      imageUpload: [],
      location: ['', Validators.required],
    });
  }

  addData() {
    let platform = this.MapService.platformHere()
    var geocoder = platform.getGeocodingService();

    if (this.currentUploadProgress < 0) { 
      // cambiar dirección a lat y lng
      let geocodingParams = {
        searchText: this.dataForm.value.location
      }
   
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
      })   
    }
    if (this.currentUploadProgress == 100) {
      // cambiar dirección a lat y lng
      let geocodingParams = {
        searchText: this.dataForm.value.location
      }

      geocoder.geocode(geocodingParams, (value) => {
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
          image: this.image
        }
        this.firebaseService.addData(object).then((value) => {
          this.dataForm.reset();
          this.form = false;
          console.log(this.addSuccessful)
        })
      }, function (e) {
        alert(e)
      })  
    this.currentUploadProgress = -1;
    }
  }

  uploadFile(event) {
    let task = this.storage.upload(event.target.files[0].name, event.target.files[0]);
    task.percentageChanges().subscribe((value) => {
      this.currentUploadProgress = value;
    })
    this.storage.ref(event.target.files[0].name).getDownloadURL().subscribe((downloadURLValue) => {
      this.image = downloadURLValue;
    })
  }

}
