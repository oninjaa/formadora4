import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import {
  personCircle,
  personOutline,
  schoolOutline,
  playOutline,
  gameControllerOutline,
  homeOutline,
  helpOutline,
  statsChart,
  statsChartOutline,
  trophy,
  checkbox,
  analyticsOutline,
  timeOutline,
  shieldCheckmarkOutline,
  documentTextOutline,
  peopleOutline,
  leafOutline,
  lockClosedOutline,
  newspaperOutline,
} from 'ionicons/icons';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});

// Registrar ícones globalmente para evitar carregamento tardio em componentes
addIcons({
  'person-circle': personCircle,
  'person-outline': personOutline,
  'school-outline': schoolOutline,
  'play-outline': playOutline,
  'game-controller-outline': gameControllerOutline,
  'home-outline': homeOutline,
  'help-outline': helpOutline,
  'stats-chart': statsChart,
  'stats-chart-outline': statsChartOutline,
  'trophy': trophy,
  'checkbox': checkbox,
  'analytics-outline': analyticsOutline,
  'time-outline': timeOutline,
  'shield-checkmark-outline': shieldCheckmarkOutline,
  'document-text-outline': documentTextOutline,
  'people-outline': peopleOutline,
  'leaf-outline': leafOutline,
  'lock-closed-outline': lockClosedOutline,
  'newspaper-outline': newspaperOutline,
  helpOutline, homeOutline,gameControllerOutline
});
