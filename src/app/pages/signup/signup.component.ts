import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface SignupRequest {
  username: string;
  nom: string;   
  prenom: string;    
  numtel: string; 
  email: string;
  address: string;   
  password: string;
  rib: string;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  userDto: SignupRequest = {
    username: '',
    nom: '',
    prenom: '',
    numtel: '',
    email: '',
    address: '',
    password: '',
    rib: ''
  };
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  passwordMismatchError: string = '';
  ribError: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.passwordMismatchError = '';
    this.ribError = '';

    if (this.userDto.password !== this.confirmPassword) {
      this.passwordMismatchError = 'Les mots de passe ne correspondent pas.';
      return;
    }

    if (!this.userDto.rib) {
          this.ribError = 'Le RIB est requis.';
          return;
        }
        if (this.userDto.rib.length !== 20) {
          this.ribError = 'Le RIB doit avoir une longueur de 20 chiffres.';
          return;
        }
        if (!this.userDto.rib.startsWith('32')) {
          this.ribError = 'Le RIB doit commencer par "32".';
          return;
        }

    const signupUrl = 'http://localhost:8089/api/auth/signup';

    this.http.post<any>(signupUrl, this.userDto)
      .subscribe({
        next: (response) => {
          this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
          console.log('Signup successful:', response);
          this.router.navigate(['/pages/login']);
        },
        error: (err) => {
          console.error('Signup failed:', err);

          if (err.status === 400 && err.error && err.error.message) {
            if (err.error.message.includes("Username is already taken")) {
              this.errorMessage = "Ce nom d'utilisateur est déjà pris.";
            } else if (err.error.message.includes("Email is already in use")) {
              this.errorMessage = "Cette adresse email est déjà utilisée.";
            } else if (err.error.message.includes("RIB not found")) {
              this.ribError = "Ce RIB n'existe pas dans notre système.";
            } else if (err.error.message.includes("RIB already claimed")) {
              this.ribError = "Ce RIB est déjà associé à un autre compte utilisateur.";
            } else {
              this.errorMessage = err.error.message;
            }
          } else if (err.status === 409) {
            this.errorMessage = "Nom d'utilisateur ou email déjà utilisé.";
          } else {
            this.errorMessage = 'Une erreur est survenue lors de l\'inscription.';
          }
        }
      });
  }
}