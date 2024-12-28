import { ApplicationConfig, Injector } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppComponent } from './app.component';
import { environment } from "../enviroments/enviroments";

/* Google credentials  */
import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.client_id
            )
          }
        ],
        onError: (error) => {
          console.error(error);
        }
      } as SocialAuthServiceConfig
    },
    provideRouter(routes),
    provideClientHydration(), 
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    {
      provide:'custom-elements',
      useFactory:(injector:Injector)=>{
        const angularElement = createCustomElement(AppComponent,{injector});
        customElements.define('app-root', angularElement);
      },
      deps:[Injector]
    },
  ]
};
