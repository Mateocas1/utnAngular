import { AfterViewInit, Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: 'textarea[appAutoResize]',
  standalone: true,
})
export class AutoResize implements AfterViewInit {
  private readonly el = inject(ElementRef<HTMLTextAreaElement>);

  ngAfterViewInit(): void {
    this.resize();
  }

  @HostListener('input')
  onInput(): void {
    this.resize();
  }

  private resize(): void {
    const el = this.el.nativeElement;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }
}
