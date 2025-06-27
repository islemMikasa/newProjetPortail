/*import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

 canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     if (typeof window !== 'undefined' && isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('jwtToken');

      if (!token) {
        return this.router.createUrlTree(['/login']);
      }

      try {
        const decodedToken: any = jwtDecode(token);
        const roles: string[] = decodedToken.roles || [];
        const requiredRole = next.data['role'] as string;

        if (requiredRole) {
          if (roles.includes(requiredRole)) {
            return true;
          } else {
            return this.router.createUrlTree(['/login']);
          }
        }

        return true;
      } catch (error) {
        console.error('Invalid token:', error);
        return this.router.createUrlTree(['/login']);
      }
    } else {
      console.log('Server-side, skipping auth check');
      return true; // Autorise côté serveur, vérification côté client
    }
  }
}*/