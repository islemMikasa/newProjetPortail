import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  standalone: true,
  imports: [RouterModule] 
})
export class AccountComponent {

  // Handle avatar upload
  onAvatarUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Add logic here to handle file upload, e.g., preview, save to server
      console.log('Avatar uploaded: ', file);
    }
  }

  // Other component methods
}
