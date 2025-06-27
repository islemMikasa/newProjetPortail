import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, NgIf,RouterModule] // Supprime CommonModule si non utilisé
})
export class LoginComponent {
  userDto = { username: '', password: '' };
  error: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.http.post<any>('http://localhost:8089/api/auth/signin', this.userDto)
      .subscribe({
        next: (response) => {
          console.log('Login response:', response); // Log pour déboguer

          // Vérifie si la réponse contient un token et des rôles
          if (response && response.token) {
            const token = response.token;
            localStorage.setItem('jwtToken', token); // Stocke le token

            const userRoles: string[] = response.roles || []; // Par défaut à un tableau vide si roles est absent
            if (userRoles.includes('ROLE_ADMIN')) {
              this.router.navigate(['/user-admin']);
            } else {
              this.router.navigate(['/profil']);
            }
          } else {
            this.error = 'Aucun token reçu du serveur. Veuillez vérifier les identifiants.';
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Login failed:', err);
          if (err.status === 401) {
            this.error = 'Informations d\'identification incorrectes. Veuillez réessayer.';
          } else if (err.status === 0) {
            this.error = 'Erreur de connexion au serveur. Vérifiez votre réseau.';
          } else {
            this.error = 'Une erreur est survenue lors de la connexion. Veuillez réessayer plus tard.';
          }
        }
      });
  }
}