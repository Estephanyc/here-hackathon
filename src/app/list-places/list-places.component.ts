import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-list-places',
  templateUrl: './list-places.component.html',
  styleUrls: ['./list-places.component.css']
})
export class ListPlacesComponent implements OnInit {
  @Input() place
  @Output() valueChange = new EventEmitter<any>();
 
  modalShow : boolean = true;
  constructor() {   }

  ngOnInit() {
  }
  routing(point1){
    this.valueChange.emit(point1);
    console.log(point1)
    this.modalShow = false
  }
  getRandomId() {
  return Math.floor((Math.random() * 100) + 1);
  }

}
