import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  list:boolean
  map: Boolean
  constructor() { }

  ngOnInit() {
    this.map = true
  }
  activeList(){
    this.list= false
    this.map = true
  }
  activeMap(){
    this.list = true
    this.map = false
  }
}
