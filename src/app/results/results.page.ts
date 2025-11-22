import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ResultsPage implements OnInit {
  userName: string = '';
  score: number = 0;
  totalQuestions: number = 0;
  percentage: number = 0;
  message: string = '';
  messageColor: string = '';
  // estatísticas por categoria (agregado de histórico)
  categoryStats: { [category: string]: { correct: number; total: number; percentage: number } } = {};
  categoryStatsArray: Array<{ key: string; value: { correct: number; total: number; percentage: number } }> = [];

  constructor(
    private router: Router,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    if (!this.quizService.getUserName()) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.userName = this.quizService.getUserName();
    this.score = this.quizService.getScore();
    this.totalQuestions = this.quizService.getTotalQuestions();
    this.percentage = this.quizService.getPercentage();
    this.setMessage();

    // Salva a tentativa no histórico
    this.quizService.saveAttempt();

    // Carrega estatísticas por categoria agregadas do histórico
    this.categoryStats = this.quizService.getCategoryStats();
    this.categoryStatsArray = Object.keys(this.categoryStats).map(key => ({
      key,
      value: this.categoryStats[key]
    }));
  }

  getCategoryIcon(category: string): string {
    if (category.includes('Pirataria')) return 'shield-checkmark-outline';
    if (category.includes('Direitos')) return 'document-text-outline';
    if (category.includes('Inclusão')) return 'people-outline';
    if (category.includes('Sustentabilidade')) return 'leaf-outline';
    if (category.includes('Proteção')) return 'lock-closed-outline';
    if (category.includes('Segurança')) return 'newspaper-outline';
    return 'help-circle-outline';
  }

  getCategoryColor(percentage: number): string {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'primary';
    if (percentage >= 40) return 'warning';
    return 'danger';
  }

  setMessage(): void {
    if (this.percentage >= 90) {
      this.message = 'Excelente! Você domina o assunto!';
      this.messageColor = 'success';
    } else if (this.percentage >= 70) {
      this.message = 'Muito bem! Bom conhecimento!';
      this.messageColor = 'secondary';
    } else if (this.percentage >= 50) {
      this.message = 'Bom trabalho! Continue estudando!';
      this.messageColor = 'warning';
    } else {
      this.message = 'Continue aprendendo! Você vai melhorar!';
      this.messageColor = 'danger';
    }
  }

  getPerformanceIcon(): string {
    if (this.percentage >= 90) return 'trophy';
    if (this.percentage >= 70) return 'ribbon';
    if (this.percentage >= 50) return 'thumbs-up';
    return 'school';
  }

  restartQuiz(): void {
    this.quizService.reset();
    this.router.navigate(['/quiz']);
  }


  viewStats(): void {
    this.router.navigate(['/statistics']);
  }

  shareResults(): void {
    const text = `Completei o Quiz de Ética Digital! Acertei ${this.score} de ${this.totalQuestions} perguntas (${this.percentage}%)!`;

    if (navigator.share) {
      navigator.share({
        title: 'Quiz de Ética Digital',
        text: text
      }).catch(() => {
        // Usuário cancelou o compartilhamento
      });
    } else {
      // Fallback: copiar para área de transferência
      navigator.clipboard.writeText(text).then(() => {
        alert('Resultado copiado para a área de transferência!');
      });
    }
  }
}

