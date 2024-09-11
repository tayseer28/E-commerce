import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimText',
  standalone: true
})
export class TrimTextPipe implements PipeTransform {

  transform(text: string, interval: number): string {
    return text.split(' ', interval).join(' ');
  }

}
