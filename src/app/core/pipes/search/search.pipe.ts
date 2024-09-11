import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(arrayOfObject: any[], searchKey: string): any[] {
    //if empty
    if(!arrayOfObject || !searchKey){
      return arrayOfObject;
    }
    //return array of object that includes searchKey
    return arrayOfObject.filter((object) => {
      return object.title.toLowerCase().includes(searchKey.toLowerCase());
    });
  }

}
