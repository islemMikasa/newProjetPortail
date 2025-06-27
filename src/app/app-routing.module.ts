import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AccountComponent } from './pages/account/account.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { UserAdminComponent } from './pages/user-admin/user-admin.component';
import { PrioriterUserComponent } from './pages/prioriter-user/prioriter-user.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'account', component: AccountComponent },
  { path: 'profil', component: ProfilComponent },
  { path: 'prioriter-user', component: PrioriterUserComponent },
  { path: 'user-admin', component: UserAdminComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }