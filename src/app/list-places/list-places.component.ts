import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-list-places',
  templateUrl: './list-places.component.html',
  styleUrls: ['./list-places.component.css']
})
export class ListPlacesComponent implements OnInit {
  @Input() place
  constructor() { }

  ngOnInit() {
  }

}
