/*import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AssociateRibRequest {
  rib: string;
}

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent {
  ribRequest: AssociateRibRequest = { rib: '' };
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    this.http.post<any>('http://localhost:8089/api/auth/associate-rib', this.ribRequest)
      .subscribe({
        next: (response) => {
          this.successMessage = response.message;
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Une erreur est survenue.';
        }
      });
  }
}*/



import { Component, OnInit } from '@angular/core'; // Ajout de OnInit
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interface pour les données utilisateur (pour récupérer et envoyer)
interface UserProfile {
    id: number; // Vous aurez besoin de l'ID de l'utilisateur pour les requêtes PUT
    username: string;
    email: string;
    nom: string;
    prenom: string;
    numtel: string;
    address: string; // Ajout de l'adresse
    // Pas de champ password ici, car on le gère séparément
}

@Component({
    selector: 'app-profil',
    standalone: true,
    imports: [FormsModule, CommonModule, RouterModule],
    templateUrl: './profil.component.html',
    styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit { // Implémentation de OnInit
    user: UserProfile = { // Initialiser avec des valeurs vides
        id: 0,
        username: '',
        email: '',
        nom: '',
        prenom: '',
        numtel: '',
        address: ''
    };

    oldPassword: string = '';
    newPassword: string = '';
    confirmNewPassword: string = '';

    errorMessage: string = '';
    successMessage: string = '';
    passwordError: string = '';
    newPasswordError: string = '';
    confirmPasswordError: string = '';

    constructor(private http: HttpClient, private router: Router) {}

    ngOnInit(): void {
       // this.fetchUserProfile(); // Appel de la fonction pour récupérer les données au démarrage
    }

    // Fonction pour récupérer les données de l'utilisateur depuis le backend
    fetchUserProfile(): void {
        // Normalement, vous obtiendrez l'ID de l'utilisateur connecté via un service d'authentification
        // Pour l'instant, utilisons un ID fictif ou récupérons-le du localStorage/sessionStorage
        // Vous devrez adapter cette partie en fonction de la manière dont vous stockez l'ID de l'utilisateur après la connexion.
        // Exemple: const userId = localStorage.getItem('userId');
        const userId = this.getUserIdFromToken(); // Supposons que vous avez une fonction pour extraire l'ID du token JWT

        if (userId) {
            this.http.get<UserProfile>(`http://localhost:8089/api/user/${userId}`)
                .subscribe({
                    next: (data) => {
                        this.user = data; // Assigner les données récupérées à la variable user
                        this.successMessage = 'Profil chargé avec succès.';
                        this.clearPasswordFields(); // S'assurer que les champs de mot de passe sont vides
                    },
                    error: (err) => {
                        console.error('Erreur lors du chargement du profil:', err);
                        this.errorMessage = err.error.message || 'Impossible de charger le profil.';
                    }
                });
        } else {
            this.errorMessage = 'ID utilisateur non trouvé. Veuillez vous reconnecter.';
            this.router.navigate(['/login']); // Rediriger vers la page de connexion
        }
    }

    // Fonction fictive pour récupérer l'ID utilisateur (à adapter à votre implémentation JWT)
    // Vous devrez probablement la déplacer vers un service d'authentification
    private getUserIdFromToken(): number | null {
        const token = localStorage.getItem('token'); // Ou là où vous stockez votre token JWT
        if (token) {
            try {
                // Décodez le token JWT pour obtenir l'ID.
                // Cela nécessite une bibliothèque JWT decoder côté client, ou un simple split si l'ID est dans le payload clair.
                // Pour cet exemple, supposons que l'ID est accessible:
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.id; // Ou payload.userId, selon la structure de votre token
            } catch (e) {
                console.error("Erreur de décodage du token JWT", e);
                return null;
            }
        }
        return null;
    }


    // Fonction pour la soumission du formulaire de mise à jour du profil
    onUpdateProfile(): void {
        // Réinitialiser les messages
        this.errorMessage = '';
        this.successMessage = '';
        this.passwordError = '';
        this.newPasswordError = '';
        this.confirmPasswordError = '';

        if (this.oldPassword || this.newPassword || this.confirmNewPassword) {
            if (!this.oldPassword) {
                this.passwordError = 'Veuillez entrer votre ancien mot de passe.';
                return;
            }
            if (!this.newPassword) {
                this.newPasswordError = 'Veuillez entrer un nouveau mot de passe.';
                return;
            }
            if (this.newPassword.length < 6 || this.newPassword.length > 40) {
                this.newPasswordError = 'Le nouveau mot de passe doit contenir entre 6 et 40 caractères.';
                return;
            }
            if (this.newPassword !== this.confirmNewPassword) {
                this.confirmPasswordError = 'Les nouveaux mots de passe ne correspondent pas.';
                return;
            }
        }

        // Créer l'objet de données à envoyer au backend
        const updateData: any = {
            username: this.user.username, // Ne sera pas utilisé par le backend pour la mise à jour si disabled
            email: this.user.email,
            nom: this.user.nom,
            prenom: this.user.prenom,
            numtel: this.user.numtel,
            addresse: this.user.address
        };

        if (this.oldPassword && this.newPassword) {
            updateData.oldPassword = this.oldPassword;
            updateData.newPassword = this.newPassword;
        }

        this.http.put<any>(`http://localhost:8089/api/user/${this.user.id}/profile`, updateData)
            .subscribe({
                next: (response) => {
                    this.successMessage = response.message || 'Profil mis à jour avec succès !';
                    console.log('Profil mis à jour:', response);
                    this.clearPasswordFields(); // Vider les champs de mot de passe après succès
                    // Optionnel: Recharger les données de l'utilisateur si le backend renvoie une version mise à jour ou pour s'assurer de la fraîcheur
                    // this.fetchUserProfile();
                },
                error: (err) => {
                    console.error('Erreur lors de la mise à jour du profil:', err);
                    this.errorMessage = err.error.message || 'Une erreur est survenue lors de la mise à jour.';
                    // Si l'ancien mot de passe est incorrect
                    if (err.status === 400 && err.error.message.includes("ancien mot de passe incorrect")) {
                        this.passwordError = err.error.message;
                    }
                }
            });
    }

    // Fonction utilitaire pour vider les champs de mot de passe
    private clearPasswordFields(): void {
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmNewPassword = '';
    }
}