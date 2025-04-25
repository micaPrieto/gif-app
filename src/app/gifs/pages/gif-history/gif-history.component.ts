import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GifService } from '../../services/gifs.service';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';


@Component({
  selector: 'app-gif-history',
  imports: [GifListComponent],
  templateUrl: './gif-history.component.html'
})
export default class GifHistoryComponent {

  GifService = inject(GifService);

   query = toSignal(
      inject(ActivatedRoute).params.pipe(map((params) => params ['query']))
    );  // No puedo importar el toSignal


    gifByKey = computed(()=>{
        return this.GifService.getHistoryGifs(this.query());
    })
}
