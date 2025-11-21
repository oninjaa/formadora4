import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router,RouterLink } from '@angular/router';
import { IonicModule, IonInput } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuizService } from '../services/quiz.service';
import { FooterNavigationComponent } from '../components/footer-navigation/footer-navigation.component';
// Ionic components usados no template vêm via IonicModule

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, FooterNavigationComponent]
})
export class WelcomePage implements OnInit {
  userName: string = '';
  hasUser: boolean = false;
  currentUserName: string = '';

  @ViewChild('nameInput') nameInput?: IonInput;

  constructor(
    private router: Router,
    private quizService: QuizService
  ) {
  }


  ngOnInit(): void {
    // Verifica se já tem nome salvo
    if (this.quizService.hasUserName()) {
      this.hasUser = true;
      this.currentUserName = this.quizService.getUserName();
    }
  }

  // tenta focar o input após a visualização para verificar se o campo aceita entrada
  ngAfterViewInit(): void {
    // pequeno atraso para garantir que o DOM esteja pronto
    setTimeout(() => {
      try {
        this.nameInput?.setFocus();
        console.log('[debug] tentou setFocus no input de nome');
      } catch (e) {
        console.warn('[debug] falha ao focar input', e);
      }
    }, 300);
  }

  onInputClick(): void {
    console.log('[debug] ion-input clicado');
  }

  onItemClick(): void {
    console.log('[debug] ion-item (container) clicado');
  }

  onStartClick(): void {
    console.log('[debug] botão Entrar (debug) clicado; userName=', this.userName);
    // tentar chamar startQuiz mesmo que o botão principal esteja desabilitado
    try {
      this.startQuiz();
    } catch (e) {
      console.warn('[debug] falha ao chamar startQuiz via onStartClick', e);
    }
  }

  startQuiz(): void {
    if (this.userName.trim()) {
      this.quizService.setUserName(this.userName.trim());
      this.quizService.clearHistory();
      this.quizService.clearHangmanHistory();
      // Atualiza estado local e navega para a aba de conteúdo
      this.currentUserName = this.userName.trim();
      this.hasUser = true;
      this.router.navigate(['/conteudo']);
    }
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

  changeUser(): void {
    this.quizService.clearUserName();
    this.hasUser = false;
    this.currentUserName = '';
  }
}

