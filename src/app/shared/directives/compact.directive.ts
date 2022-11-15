import { AfterViewInit, Directive, ElementRef, OnInit } from '@angular/core';
import { FormControlName } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';

@Directive({
  selector: '[compact]',
})
export class CompactDirective implements OnInit, AfterViewInit {
  private element!: ElementRef;
  private input!: FormControlName;

  constructor(
    private matformfield: MatFormField
  ) { }
  
  ngOnInit(): void {
    this.element = this.matformfield._elementRef;

    this.element.nativeElement.classList.add('compactable');
    this.element.nativeElement.classList.add('compact');
  }

  ngAfterViewInit(): void {
    this.input = (this.matformfield._control.ngControl as FormControlName);
    
    this.element.nativeElement.querySelector('input').addEventListener('blur', this.updateCompact)
    this.input.statusChanges?.subscribe(this.updateCompact);
  }

  private updateCompact = () => {
    if (this.input.touched && this.input.errors != null) {
      this.element.nativeElement.classList.remove('compact');
    } else {
      this.element.nativeElement.classList.add('compact');
    }
  }
}
