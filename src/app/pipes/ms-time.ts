import {Pipe, PipeTransform} from '@angular/core';

var moment = require('moment');

@Pipe({name: 'msTime'})
export class MsTimePipe implements PipeTransform {
  transform(value: number) : string {
    return moment.utc(value).format('HH:mm:ss');
  }
}
