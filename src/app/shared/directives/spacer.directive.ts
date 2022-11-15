import { Directive, HostBinding, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[spacer]'
})
export class SpacerDirective implements OnInit {
  @Input() spacer: string = '';
  @HostBinding('style.flex') flex: string = '1 1 auto';

  ngOnInit(): void {
    this.flex = !!this.spacer ? `0 0 ${this.spacer}` : this.flex;
  }
}
