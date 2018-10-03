import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  dataForm: FormGroup;
  image: any;
  currentUploadProgress:number = -1;

  constructor(private firebaseService: FirebaseService, private formBuilder: FormBuilder, private storage: AngularFireStorage) {
    this.createData();
   };

  ngOnInit() {
  }

  createData() {
    this.dataForm = this.formBuilder.group({
      name: ['', Validators.required],
      product: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      adress: ['', Validators.required],
      phone: ['', Validators.required],
      website: ['', Validators.required],
      lat: ['', Validators.required],
      long: ['', Validators.required],
      imageUpload: []
    });
  }

  addData() {
    if (this.currentUploadProgress < 0) {
    let prueba = {
      name: this.dataForm.value.name,
      product: this.dataForm.value.product,
      category: this.dataForm.value.category,
      description: this.dataForm.value.description,
      l: {
        0: this.dataForm.value.lat,
        1: this.dataForm.value.long,
      },
      phone: this.dataForm.value.phone,
      website: this.dataForm.value.website,
    }
    this.firebaseService.addData(prueba)
  }
  if (this.currentUploadProgress == 100) {
    let prueba = {
      name: this.dataForm.value.name,
      product: this.dataForm.value.product,
      category: this.dataForm.value.category,
      description: this.dataForm.value.description,
      l: {
        0: this.dataForm.value.lat,
        1: this.dataForm.value.long,
      },
      phone: this.dataForm.value.phone,
      website: this.dataForm.value.website,
      image: this.image
    }
    this.firebaseService.addData(prueba)
  }
  this.currentUploadProgress = -1;
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

