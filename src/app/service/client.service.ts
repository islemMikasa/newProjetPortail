import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client {
  prenom: string;
  nom: string;
  ribValue: string;
  email: string;
  numtel: string;
  password?: string; // Optionnel pour sécurité
  balanceAmount: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8089/api/admin';

  constructor(private http: HttpClient) {}

  getClientByUsername(username: string): Observable<Client | null> {
    return this.http.get<Client | null>(`${this.apiUrl}/search-client?username=${username}`);
  }

  updateClient(username: string, client: Client): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-client`, { username, ...client });
  }
}