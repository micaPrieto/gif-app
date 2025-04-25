import { Gif } from "../interfaces/gif.interface";
import { GiphyItem } from "../interfaces/giphy.interfaces";

//Recibe un objeto que viene de la API Giphy, y retorna un objeto basado en nuestra interface
export class GifMapper{

  static mapGiphyItemToGif(item: GiphyItem) : Gif
  {
    return {
      id: item.id,
      title: item.title,
      url:item.images.original.url
    }
  }

  static mapGiphyItemsToGifArray(items: GiphyItem[]): Gif[]{
    return items.map(this.mapGiphyItemToGif);
    //transforma cada uno de los elementos recibidos del Array de GiphyItem, y los transforma en un objetos Gif colocandolos en un array
  }
}
