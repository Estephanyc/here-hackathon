import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  dataForm: FormGroup;

  constructor(private firebaseService: FirebaseService, private formBuilder: FormBuilder) {
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
    });
  }

  addData() {
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
}

