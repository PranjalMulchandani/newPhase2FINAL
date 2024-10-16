import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';  
import { RouterModule } from '@angular/router';  
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChatComponent } from './components/chat/chat.component';
import { FormsModule } from '@angular/forms';  
import { HttpClientModule } from '@angular/common/http';  
import { RegisterComponent } from './components/register/register.component';
import { GroupManagementComponent } from './components/group-management/group-management.component'; 
import { SuperAdminComponent } from './components/super-admin/super-admin.component'; 
import { VideoChatComponent } from './components/video-chat/video-chat.component';



const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent,
    ProfileComponent,
    RegisterComponent,
    VideoChatComponent,
    SuperAdminComponent,
    GroupManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,  
    RouterModule,  
    FormsModule,  
    HttpClientModule,
    SocketIoModule.forRoot(config)  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
