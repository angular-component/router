import {
  Directive,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

interface MediaQueryPayload {
  readonly matches: boolean;
  readonly media: string;
}

@Directive({
  selector: '[media]',
})
export class MediaDirective implements OnDestroy {
  private hasView = false;
  private listenerCleanup: () => void;

  @Input() set media(query: string) {
    this.cleanup();
    this.initListener(query);
  }

  constructor(
    private readonly viewContainer: ViewContainerRef,
    private readonly template: TemplateRef<unknown>
  ) {}

  ngOnDestroy() {
    this.cleanup();
  }

  private cleanup() {
    if (this.listenerCleanup) {
      this.listenerCleanup();
    }
  }

  private attachListener(
    query: string,
    listener: (event: MediaQueryPayload) => void
  ): void {
    const mediaQueryList = window.matchMedia(query);
    this.addListener(mediaQueryList, listener);
    this.listenerCleanup = () => this.removeListener(mediaQueryList, listener);
    // trigger initial
    listener(mediaQueryList);
  }

  private addListener(
    mql: MediaQueryList,
    listener: (event: MediaQueryPayload) => void
  ): void {
    mql.addEventListener
      ? mql.addEventListener('change', listener)
      : // add deprecated listeners for fallback
        mql.addListener(listener);
  }

  private removeListener(
    mql: MediaQueryList,
    listener: (event: MediaQueryPayload) => void
  ): void {
    mql.removeEventListener
      ? mql.removeEventListener('change', listener)
      : // add deprecated remove listeners for fallback
        mql.removeListener(listener);
  }

  private initListener(query: string): void {
    if (window) {
      const listener = (event: MediaQueryPayload) => {
        if (event.matches && !this.hasView) {
          this.renderView();
        }
        if (!event.matches && this.hasView) {
          this.clearView();
        }
      };
      this.attachListener(query, listener);
    }
  }

  private renderView(): void {
    this.hasView = true;
    this.viewContainer.createEmbeddedView(this.template);
  }

  private clearView(): void {
    this.hasView = false;
    this.viewContainer.clear();
  }
}
