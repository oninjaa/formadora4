import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { helpOutline, homeOutline,gameControllerOutline} from 'ionicons/icons';
import { Router } from '@angular/router';
import { FooterNavigationComponent } from '../components/footer-navigation/footer-navigation.component';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, FooterNavigationComponent]
})
export class AboutPage implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;
  public hasUser = false;

  constructor(private router: Router, private quizService: QuizService) {
    this.hasUser = this.quizService.hasUserName();
  }

  ngAfterViewInit(): void {
    // observe elements with class 'reveal' and add 'in-view' when visible
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('in-view');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    const els = document.querySelectorAll('.reveal, .topic-block');
    els.forEach((el) => this.observer?.observe(el));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
