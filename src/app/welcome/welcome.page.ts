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
export class WelcomePage implements OnInit, AfterViewInit {
  userName: string = '';
  hasUser: boolean = false;
  currentUserName: string = '';

  // dicas
  tipsData: Record<string, { dica: string; relacionado?: string[] }[]> = {};
  displayedTips: Array<{ category: string; tip: { dica: string; relacionado?: string[] } }> = [];
  tipsAnimating = false;

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

    // Carrega as dicas do arquivo assets/dicas.json
    this.loadTips();
  }

  private async loadTips() {
    try {
      const resp = await fetch('assets/dicas.json');
      if (!resp.ok) return;
      const data = await resp.json();
      this.tipsData = data;
      this.refreshTips();
    } catch (e) {
      // falha no fetch -> mantemos sem dicas (silencioso em produção)
    }
  }

  // seleciona 3 dicas únicas aleatórias (de quaisquer categorias)
  // método interno — atualiza imediatamente
  refreshTips() {
    const pool: Array<{ category: string; tip: { dica: string; relacionado?: string[] } }> = [];
    for (const cat of Object.keys(this.tipsData || {})) {
      const arr = this.tipsData[cat] || [];
      for (const t of arr) pool.push({ category: cat, tip: t });
    }

    // embaralha e pega até 3
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    this.displayedTips = pool.slice(0, 3);
  }

  // Método que dispara animação e troca as dicas
  triggerRefreshTips() {
    if (!this.tipsData || Object.keys(this.tipsData).length === 0) return;
    // liga animação, espera, trocando dicas logo em seguida
    this.tipsAnimating = true;
    setTimeout(() => {
      this.refreshTips();
      // pequena pausa para deixar a transição perceptível
      setTimeout(() => (this.tipsAnimating = false), 120);
    }, 260);
  }

  formatCategory(cat: string) {
    return cat ? cat.replace(/_/g, ' ') : '';
  }

  // tenta focar o input após a visualização para verificar se o campo aceita entrada
  ngAfterViewInit(): void {
    // pequeno atraso para garantir que o DOM esteja pronto
    setTimeout(() => {
      try {
        this.nameInput?.setFocus();
      } catch (e) {
        // foco falhou — comportamento silencioso em produção
      }
    }, 300);
  }

  onInputClick(): void {
    // tempo reservado para manipulador de clique do input
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

