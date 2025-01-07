import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';


const URL = environment.URL;

@Pipe({
  name: 'imagenProfile',
  standalone: true
})
export class ImagenProfilePipe implements PipeTransform {

  transform(image:string | undefined | null): string {
    return `${URL}/auth/profile/${image}`;
  }

}
