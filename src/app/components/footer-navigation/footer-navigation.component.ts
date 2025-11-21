import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonFooter, IonTabBar, IonTabButton, IonIcon,IonLabel} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { helpOutline, homeOutline,gameControllerOutline} from 'ionicons/icons';

@Component({
  selector: 'app-footer-navigation',
  templateUrl: './footer-navigation.component.html',
  styleUrls: ['./footer-navigation.component.scss'],
  standalone: true,
  imports: [IonFooter, IonTabBar, IonTabButton, IonIcon,IonLabel, CommonModule, RouterModule]
})
export class FooterNavigationComponent {
  @Input() currentPage: 'welcome' | 'conteudo' | 'about' = 'welcome';
  constructor() {
    addIcons({ helpOutline, homeOutline,gameControllerOutline});}


}
