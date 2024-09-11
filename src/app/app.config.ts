import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { headerInterceptor } from './core/interceptor/header/header.interceptor';
import { errorsInterceptor } from './core/interceptor/errors/errors.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './core/interceptor/loading/loading.interceptor';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

//this function is responsible for loading the translation files from the server
//the first paramter is the httpClient, the second parameter is the path to the translation files, and the third parameter is the file extension
//so we will create i18n folder in the assets folder and put the translation files in it
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withViewTransitions()), 
  provideClientHydration(), 
  provideHttpClient(
  withFetch(),
  withInterceptors([headerInterceptor, errorsInterceptor, loadingInterceptor])
),
  provideAnimations(),//to provide the animation of owl carousel4
  provideToastr(), // Toastr providers
  importProvidersFrom(NgxSpinnerModule, 
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ) // NgxSpinner providers

  
]
};
