import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true
})
export class CustomDatePipe implements PipeTransform {

  transform(createdDate: any):unknown {
    const now = new Date();
    const diffInMilliseconds = now.getTime() - new Date(createdDate).getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays} days`;
    if (diffInHours > 0) return `${diffInHours} hours`;

    return `${diffInMinutes} minute`;

  }

}
