import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ChatComponent } from './components/chat/chat.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component'; 
import { SuperAdminComponent } from './components/super-admin/super-admin.component';  
import { GroupManagementComponent } from './components/group-management/group-management.component';
import { VideoChatComponent } from './components/video-chat/video-chat.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'video-chat', component: VideoChatComponent },
  { path: 'group-management', component: GroupManagementComponent },
  { path: 'super-admin', component: SuperAdminComponent }, 
   { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
