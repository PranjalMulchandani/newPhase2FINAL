
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private baseUrl: string = 'http://localhost:5000/api/groups';

  constructor(private http: HttpClient) {}


  loadGroups(): Observable<any> {
    return this.http.get(this.baseUrl);
  }


  // createGroup(groupName: string): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/create`, { name: groupName });
  // }
  createGroup(groupName: string) {
    return this.http.post('http://localhost:5000/api/groups/create', { name: groupName });
  }
  

  removeGroup(groupId: string) {
    return this.http.delete(`http://localhost:5000/api/groups/${groupId}`);
  }
  
  addChannel(groupId: string, channelName: string) {
    return this.http.post(`http://localhost:5000/api/groups/${groupId}/addChannel`, { channelName });
  }
  
}

