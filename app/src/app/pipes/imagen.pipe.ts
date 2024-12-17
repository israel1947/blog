import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../enviroments/enviroments';


const URL = environment.URL;

@Pipe({
  name: 'imagen',
  standalone: true
})
export class ImagenPipe implements PipeTransform {

  transform(image:string | undefined | null): string {
    return `${URL}/posts/image/${image}`;
  }

}
