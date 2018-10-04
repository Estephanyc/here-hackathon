import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-list-places',
  templateUrl: './list-places.component.html',
  styleUrls: ['./list-places.component.css']
})
export class ListPlacesComponent implements OnInit {
  @Input() place
  @Output() valueChange = new EventEmitter<any>();
 
  constructor() {   }

  ngOnInit() {
  }
  routing(point1, key){
    this.valueChange.emit(point1);
    let div = <HTMLElement>document.querySelector('.modal-backdrop');
    div.style.display = "none";
    let div2 = <HTMLElement>document.querySelector('.modal-open');
    div2.style.overflow = "visible" 
   }
}
