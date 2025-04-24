import { Component, Input } from '@angular/core';

@Component({
  selector: 'gif-list-item',
  imports: [],
  templateUrl: './gif-list-item.component.html'
})
export class GifListItemComponent {


  @Input()
  imageUrl : string = '';

}
