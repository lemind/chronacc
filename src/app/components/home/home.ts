import {Component} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {Http} from 'angular2/http';

//import {Title} from './providers/title';
//import {XLarge} from './directives/x-large';

@Component({
  selector: 'home',
  providers: [ ],
  directives: [ ],
  pipes: [ ],
  styles: [ require('./home.css') ],
  template: require('./home.html')
})
export class Home {
  // TypeScript public modifiers
  constructor() {

  }

  ngOnInit() {
    console.log('hello MyHome component');
  }

}
