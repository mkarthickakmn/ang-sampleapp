import { Directive, OnInit, ElementRef } from '@angular/core';
import {MatInput} from '@angular/material/input';
@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements OnInit {
 
  constructor(private el: ElementRef,private matInput: MatInput) {
  }
 
  ngOnInit() {
 setTimeout(() => this.matInput.focus());
   
  }
 
}