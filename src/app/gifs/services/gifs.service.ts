import type { GiphyResponse } from './../interfaces/giphy.interfaces';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';

@Injectable({providedIn: 'root'})
export class GifService {

  private http = inject(HttpClient);

  constructor(){
    this.loadTrendingGifs();
  }

  baseUrl= environment.giphyUrl;

  $trendingGifs = signal<Gif[]>([]);
  $trendingGifsLoading = signal(true); //Esta señal me indica si se estan cargando los gifs

  //getGifts() : Observable <GiphyResponse | any> { }
  loadTrendingGifs()
    {   //En el archivo "environments" esta guardado el Url de la api, el cual acá esta tomando para hacer la peticion get
       this.http.get<GiphyResponse>(`${ this.baseUrl}/gifs/trending`, //Retorna un objeto de tipo GiphyResponse
        { //Le tengo que mandar el API KEY, que tambien esta en environments
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
          }
        }).subscribe( (resp) =>{

          //Llamo a la funcion que los tranforma de objetos GiphyResponse, a objetos Gif, y me devuelve un array con todos ellos
          const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
          this.$trendingGifs.set(gifs); //Actualizo mi variable local, guardando alli el arrey de gifs

          this.$trendingGifsLoading.set(false); //Cuando termina de cargar los gifs, avisa a traves de esta señal que ya esta cargado

          console.log({gifs});

        })
    } //retorna un observable o un array vacio (para esta ultima opcion mirar el video de chaldu que lo hace con un pipe)



}
