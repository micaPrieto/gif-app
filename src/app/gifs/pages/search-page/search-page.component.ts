import { Component, inject, signal } from '@angular/core';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';
import { GifMapper } from '../../mapper/gif.mapper';


//Record<string,Gif[]> //Tipado para un objeto de llaves dinamicas, donde ir agregando atributos

@Component({
  selector: 'app-search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export default class SearchPageComponent {

  gifService = inject(GifService);
  gifs = signal<Gif[]>([]); //Lo inicializo como un arreglo vacio

  onSearch(query:string){
      this.gifService.searchGifs(query)
      .subscribe(resp => {
        this.gifs.set(resp);
      })
  }


}
