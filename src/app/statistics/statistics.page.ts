import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizService, UserStats, QuizAttempt, HangmanStats, HangmanGame } from '../services/quiz.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class StatisticsPage implements OnInit {
  titleVisible: boolean = true;
  stats: UserStats | null = null;
  categoryStats: { [category: string]: { correct: number; total: number; percentage: number } } = {};
  categoryStatsArray: Array<{ key: string; value: { correct: number; total: number; percentage: number } }> = [];
  recentAttempts: QuizAttempt[] = [];
  showAllAttempts: boolean = false;

  // Estatísticas do jogo da forca
  hangmanStats: HangmanStats | null = null;
  recentHangmanGames: HangmanGame[] = [];
  showAllHangmanGames: boolean = false;
  activeTab: string = 'quiz'; // 'quiz' ou 'hangman'

  constructor(
    private router: Router,
    private quizService: QuizService,
    private alertController: AlertController
  ) {}

  async exitStatistics(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Sair das Estatísticas',
      message: 'Deseja voltar ao menu principal?',
      buttons: [
        {
          text: 'Continuar',
          role: 'cancel'
        },
        {
          text: 'Voltar ao Menu',
          role: 'destructive',
          handler: () => {
            this.router.navigate(['/conteudo']);
          }
        }
      ]
    });

    await alert.present();
  }

  onScroll(event: any): void {
    // event.detail.scrollTop is provided by IonContent scroll events
    const scrollTop = event && event.detail ? event.detail.scrollTop : 0;
    // reduzir limiar para esconder o título mais rápido (5px)
    this.titleVisible = scrollTop <= 5;
  }

  ngOnInit(): void {
    if (!this.quizService.getUserName()) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.loadStats();
  }

  ionViewWillEnter(): void {
    // Recarrega dados toda vez que a página é acessada
    this.loadStats();
  }

  loadStats(): void {
    this.stats = this.quizService.getUserStats();
    this.categoryStats = this.quizService.getCategoryStats();

    // Converte para array para usar no template
    this.categoryStatsArray = Object.keys(this.categoryStats).map(key => ({
      key: key,
      value: this.categoryStats[key]
    }));

    // Pega as últimas 5 tentativas (mais recentes primeiro)
    this.recentAttempts = [...this.stats.attempts]
      .reverse()
      .slice(0, this.showAllAttempts ? undefined : 5);

    // Carrega estatísticas do jogo da forca
    this.hangmanStats = this.quizService.getHangmanStats();
    const hangmanHistory = this.quizService.getHangmanHistory();
    this.recentHangmanGames = [...hangmanHistory]
      .reverse()
      .slice(0, this.showAllHangmanGames ? undefined : 5);
  }

  toggleAllAttempts(): void {
    this.showAllAttempts = !this.showAllAttempts;
    this.loadStats();
  }

  getPerformanceColor(percentage: number): string {
    if (percentage >= 90) return 'success';
    if (percentage >= 70) return 'secondary';
    if (percentage >= 50) return 'warning';
    return 'danger';
  }

  getPerformanceIcon(percentage: number): string {
    if (percentage >= 90) return 'trophy';
    if (percentage >= 70) return 'ribbon';
    if (percentage >= 50) return 'thumbs-up';
    return 'school';
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

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getProgressPercentage(attempt: QuizAttempt): number {
    return attempt.percentage;
  }

  goToQuiz(): void {
    this.quizService.reset();
    this.router.navigate(['/quiz']);
  }

  async clearHistory(): Promise<void> {
    const confirm = window.confirm('Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.');
    if (confirm) {
      this.quizService.clearHistory();
      this.loadStats();
    }
  }

  getCategoryPercentage(category: string): number {
    const stats = this.categoryStats[category];
    return stats ? stats.percentage : 0;
  }

  getCategoryColor(percentage: number): string {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'primary';
    if (percentage >= 40) return 'warning';
    return 'danger';
  }

  getTrendIcon(): string {
    if (!this.stats || this.stats.attempts.length < 2) return 'remove-outline';

    const recent = this.stats.attempts.slice(-5);
    const firstHalf = recent.slice(0, Math.ceil(recent.length / 2));
    const secondHalf = recent.slice(Math.ceil(recent.length / 2));

    const avgFirst = firstHalf.reduce((acc, a) => acc + a.percentage, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((acc, a) => acc + a.percentage, 0) / secondHalf.length;

    if (avgSecond > avgFirst + 5) return 'trending-up';
    if (avgSecond < avgFirst - 5) return 'trending-down';
    return 'remove-outline';
  }

  getTrendColor(): string {
    const icon = this.getTrendIcon();
    if (icon === 'trending-up') return 'success';
    if (icon === 'trending-down') return 'danger';
    return 'medium';
  }

  getEvolutionMessage(): string {
    if (!this.stats || this.stats.attempts.length === 0) {
      return 'Faça seu primeiro quiz para começar!';
    }
    if (this.stats.attempts.length === 1) {
      return 'Continue fazendo quizzes para ver sua evolução!';
    }

    const trend = this.getTrendIcon();
    if (trend === 'trending-up') {
      return 'Parabéns! Você está evoluindo! 🚀';
    }
    if (trend === 'trending-down') {
      return 'Continue estudando, você vai melhorar! 📚';
    }
    return 'Seu desempenho está estável. Continue assim!';
  }

  hasCategoryStats(): boolean {
    return Object.keys(this.categoryStats).length > 0;
  }

  toggleAllHangmanGames(): void {
    this.showAllHangmanGames = !this.showAllHangmanGames;
    this.loadStats();
  }

  async clearHangmanHistory(): Promise<void> {
    const confirm = window.confirm('Tem certeza que deseja limpar o histórico do jogo da forca? Esta ação não pode ser desfeita.');
    if (confirm) {
      this.quizService.clearHangmanHistory();
      this.loadStats();
    }
  }
  
   goToHangman(): void {
    this.router.navigate(['/hangman']);
  }
}

