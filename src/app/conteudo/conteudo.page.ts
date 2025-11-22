import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { FooterNavigationComponent } from '../components/footer-navigation/footer-navigation.component';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-conteudo',
  templateUrl: './conteudo.page.html',
  styleUrls: ['./conteudo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, FooterNavigationComponent]
})
export class ConteudoPage implements OnInit {

  public currentUserName = '';
  public hasUser = false;

  constructor(private router: Router, private quizService: QuizService, private alertCtrl: AlertController) { }

  async ngOnInit() {
    if (!this.quizService.hasUserName()) {
      const alert = await this.alertCtrl.create({
        header: 'Atenção',
        message: 'Digite seu nome e leia as instruções',
        buttons: [
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              this.router.navigate(['/welcome']);
            }
          }
        ]
      });
      await alert.present();
      return;
    }
    this.currentUserName = this.quizService.getUserName();
    this.hasUser = true;
  }

  goToQuiz(): void {
    this.quizService.reset();
    this.router.navigate(['/quiz']);
  }

  goToHangman(): void {
    this.router.navigate(['/hangman']);
  }

  goToStatistics(): void {
    this.router.navigate(['/statistics']);
  }

}
