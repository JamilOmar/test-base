import { Component, OnInit } from '@angular/core';
import {Message} from 'base-common';
@Component({
  selector: 'lib-my-lib',
  template: `
    <p>
      my-lib works!
    </p>
  `,
  styles: [
  ]
})
export class MyLibComponent implements OnInit {

  constructor() {
    
   }

   public getMessage():Message{
     return {name:'Paul'}
   }

  ngOnInit(): void {
    console.log(this.getMessage())
  }

}
