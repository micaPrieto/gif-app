import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

import type { GiphyResponse } from './../interfaces/giphy.interfaces';
import { environment } from '../../../environments/environment';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';




const loadFromLocalStorage= () => {
  const gifsFromLocalStorage = localStorage.getItem('gifs') ?? '{}';
   const gifs = JSON.parse(gifsFromLocalStorage);
   console.log(gifs);
   return gifs;
}



@Injectable({providedIn: 'root'})
export class GifService {

  private http = inject(HttpClient);

  constructor(){
    this.loadTrendingGifs();
  }

  baseUrl= environment.giphyUrl;
  $trendingGifs = signal<Gif[]>([]);
  $trendingGifsLoading = signal(true); //Esta señal me indica si se estan cargando los gifs

 //------------ HISTORIAL ------------
  /*   {
          'goku': [gif1, gif2, gif3],
          'iron man' : [gif1, gif2, gif3],
          'thor' : [gif1, gif2, gif3],
        }                                         */
  searchHistory = signal<Record <string, Gif[]> > (loadFromLocalStorage())
  //Señal de tipo record,  llave de tipo string, que apunta a un arreglo de Gifs
  // que se inicializa como un objeto vacio

  searchHistoryKeys = computed( ()=> Object.keys(this.searchHistory()) );
  //cada vez que esta señal cambie, se va a volver a computar esta señal
  //computed: señal computada


   //!----------------- Local Storage --------------------------

     //Guardo en el LocalSotoraje mi arreglo de Gifs
     saveGifToLocalStorage = effect(()=>{
      const historyString = JSON.stringify(this.searchHistory()); //Lo paso a string
      localStorage.setItem('gifs',historyString ) //Lo guardo en el LocalStorage
    })
    //Efecto: es una operación que se ejecuta al menos una vez (similar al ngOnInit),
    // pero si usa alguna señal,  y esa señal cambia, el efecto se vuelve a ejecutar.
    // Cada vez que la señal cambie, automaticamente va a disparar este efecto

  //?-------------------------- GET -------------------------------------
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

          this.$trendingGifs.set(gifs); //Actualizo mi variable local, guardando alli el array de gifs

          this.$trendingGifsLoading.set(false); //Cuando termina de cargar los gifs, avisa a traves de esta señal que ya esta cargado

          console.log({gifs});
        })
    } //retorna un observable o un array vacio (para esta ultima opcion mirar el video de chaldu que lo hace con un pipe)


     //?----------------------- BUSCAR GIFS -----------------------------
    searchGifs(query:string): Observable<Gif[]>
    {
      //Retorna un objeto de tipo GiphyResponse
      return this.http.get<GiphyResponse>(`${ this.baseUrl}/gifs/search`,  //!SEARCH
        { //Le tengo que mandar el API KEY, que tambien esta en environments
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
          q: query, //! acá le envio el string recibido por parametro
          }
        })
        .pipe(
          map(({data}) => data),
          map((items) => GifMapper.mapGiphyItemsToGifArray(items)),

          //-------- Historial ---------
          //TAP: operador de RxJS para manejar efectos secundarios
          tap (items =>{
            this.searchHistory.update(history=>({
              ...history,
              [query.toLocaleLowerCase()] : items,
            }))
          })
        )
    }

    getHistoryGifs(query:string) :Gif[]{
      return this.searchHistory()[query] ?? [];
      //Que devuelva lo que hay en el query, o un arreglo vacio si no encuentra nada
    }


}



