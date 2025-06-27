import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../service/client.service';
import { Client } from '../../service/client.service'; // Assure-toi que l'interface Client est définie
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppModule } from '../../app.module';

@Component({
  selector: 'app-user-admin',
  standalone: true, // Changé en true pour standalone
  imports: [CommonModule, FormsModule,RouterModule], // Importe FormsModule pour ngModel
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent implements OnInit {
  isEditing: boolean = false;

  // Propriétés pour l'affichage et la modification des données du client
  ribValue: string = '';
  nom: string = '';
  prenom: string = '';
  email: string = '';
  numtel: string = '';
  password: string = ''; // Ne pas renvoyer le mot de passe réel depuis le backend
  balanceAmount: string = '';

  // Propriétés pour la recherche et l'affichage du nom complet
  searchUsername: string = '';
  clientFullName: string = 'Aucun client sélectionné'; // Message par défaut

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    // Optionnel : charger un client par défaut si nécessaire
  }

  searchClient(): void {
    const usernameToSearch = this.searchUsername.trim();

    if (!usernameToSearch) {
      alert('Veuillez entrer un nom d\'utilisateur pour la recherche.');
      this.resetClientData();
      return;
    }

    this.isEditing = false; // Désactive l'édition avant la recherche

    this.clientService.getClientByUsername(usernameToSearch).subscribe({
      next: (client: Client | null) => {
        if (client) {
          this.prenom = client.prenom || '';
          this.nom = client.nom || '';
          this.ribValue = client.ribValue || '';
          this.email = client.email || '';
          this.numtel = client.numtel || '';
          this.password = '********'; // Sécurité : ne pas afficher le vrai mot de passe
          this.balanceAmount = client.balanceAmount || '0,000 DT';
          this.clientFullName = `${this.prenom} ${this.nom}`;
        } else {
          this.clientFullName = `Client "${usernameToSearch}" non trouvé`;
          this.resetClientData();
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du client:', err);
        this.clientFullName = 'Erreur lors de la recherche';
        this.resetClientData();
      }
    });
  }

  private resetClientData(): void {
    this.prenom = '';
    this.nom = '';
    this.ribValue = '';
    this.email = '';
    this.numtel = '';
    this.password = '';
    this.balanceAmount = '0,000 DT';
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    if (!this.isEditing) return;

    const updatedClient: Client = {
      prenom: this.prenom,
      nom: this.nom,
      ribValue: this.ribValue,
      email: this.email,
      numtel: this.numtel,
      password: this.password,
      balanceAmount: this.balanceAmount
    };

    this.clientService.updateClient(this.searchUsername, updatedClient).subscribe({
      next: (res) => {
        console.log('Client mis à jour avec succès', res);
        this.isEditing = false;
        alert('Profil mis à jour !');
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du client', err);
        alert('Échec de la mise à jour du profil.');
      }
    });
  }
}