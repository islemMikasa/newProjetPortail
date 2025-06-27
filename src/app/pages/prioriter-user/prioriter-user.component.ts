import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';

interface PrioritizationData {
  rib: string;
  solde: string;
  username: string;
}

@Component({
  selector: 'app-prioriter-user',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './prioriter-user.component.html',
  styleUrls: ['./prioriter-user.component.css'],
})
export class PrioriterUserComponent implements OnInit, OnDestroy {
  rib: string = '';
  solde: string = '';
  usernames: string[] = [];
  selectedUsername: string = '';
  message: string = '';
  private refreshSubscription: Subscription | undefined;

  private apiUrl = 'http://localhost:8089/api/admin';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadUsernames();

    this.refreshSubscription = interval(5000).subscribe(() => {
      this.loadUsernames();
    });
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadUsernames() {
    this.http.get<string[]>(`${this.apiUrl}/usernames`).subscribe({
      next: (data) => {
        this.usernames = data;

        if (this.selectedUsername && !this.usernames.includes(this.selectedUsername)) {
          this.selectedUsername = '';
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des usernames:', err);
        this.message = 'Erreur lors du chargement des usernames. Vérifiez la connexion ou le serveur.';
      }
    });
  }

affecter() {
  this.message = '';
  if (!this.rib || !this.solde || !this.selectedUsername) {
    this.message = 'Veuillez remplir tous les champs.';
    return;
  }

  const data: PrioritizationData = {
    rib: this.rib,
    solde: this.solde,
    username: this.selectedUsername
  };

  const headers = { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpc2xlbS5tb3Vzc2FvdWkiLCJpYXQiOjE3NTA5NTQxNzksImV4cCI6MTc1MTA0MDU3OX0.Bp0UUsiFRvZjbDz6YnjnIkuHXfx35Sqekjvne4rt05U' };
  this.http.post<any>(`${this.apiUrl}/accounts/prioritize`, data, { headers }).subscribe({
    next: (response) => {
      this.message = 'Priorisation effectuée avec succès !';
      this.rib = '';
      this.solde = '';
      this.selectedUsername = '';
      this.loadUsernames();
    },
    error: (err) => {
      console.error('Erreur lors de la priorisation:', err);
      this.message = err.error?.message || 'Erreur lors de la priorisation. Vérifiez les données.';
    }
  });
}
}