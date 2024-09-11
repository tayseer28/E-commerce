import { isPlatformBrowser } from '@angular/common';
import { Inject, inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class OwnTranslateService {

  // private readonly _TranslateService = inject(TranslateService)

  //we set the logic inside the constructor caue we want it to be executed once the service is created
  //and there is no ngOnInit in services
  private _Renderer2  = inject(RendererFactory2).createRenderer(null, null);// we create a renderer2 instance to be able to set the dir attribute on the html tag

  constructor(
    private _TranslateService: TranslateService,
    @Inject(PLATFORM_ID) private platId: object

  ) {


    if (isPlatformBrowser(this.platId)) { // Browser
      // this language will be used as a fallback when a translation isn't found in the current language this._TranslateService.setDefaultLang(  'en'  );
      this._TranslateService.setDefaultLang('en')
      this.setLang();

    }

  }

  setLang(): void {

    let savedLang = localStorage.getItem('lang');
    if (savedLang) {
      this._TranslateService.use(savedLang);
    }

    if (localStorage.getItem('lang') === 'en') {
      // dir ltr
      // document.dir = 'ltr';
      this._Renderer2.setAttribute(document.documentElement, 'dir', 'ltr');
      this._Renderer2.setAttribute(document.documentElement, 'lang', 'en');
    }
    else if (localStorage.getItem('lang') === 'ar') {
      //dir rtl
      // document.dir = 'rtl';
      this._Renderer2.setAttribute(document.documentElement, 'dir', 'rtl');
      this._Renderer2.setAttribute(document.documentElement, 'lang', 'ar');

    }
  }

  changeLang(lang: string): void {
    if(isPlatformBrowser(this.platId)){
      localStorage.setItem('lang'  , lang);
    }
    this.setLang();
  }
}
