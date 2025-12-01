import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
// Importar las herramientas necesarias para Interceptores
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http'; 
// Importar el interceptor (Asegúrate de que la ruta sea correcta)
import { TokenInterceptor } from './core/interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    // Habilitar HttpClient con soporte para inyección de interceptores (withInterceptorsFromDi)
    provideHttpClient(withInterceptorsFromDi()), 
    {
      // Proveer la clase del interceptor
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true // Permite que existan múltiples interceptores
    },
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};