import { LOCALSTORAGE_TOKEN_KEY } from './../../../app.module';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Friend, LoginRequest, LoginResponse, Profile, RegisterRequest, RegisterResponse } from '../../interfaces';
import { Status } from '../../interfaces';

export const fakeLoginResponse: LoginResponse = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  refreshToken: {
    id: 1,
    userId: 2,
    token: 'fakeRefreshToken...should al come from real backend',
    refreshCount: 2,
    expiryDate: new Date(),
  },
  tokenType: 'JWT'
}

export const fakeRegisterResponse: RegisterResponse = {
  status: 200,
  message: 'Registration sucessfull.'
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private profile = new String;

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private jwtService: JwtHelperService
  ) { }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return of(fakeLoginResponse).pipe(
      tap((res: LoginResponse) => localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, res.accessToken)),
      tap(() => this.snackbar.open('Login Successfull', 'Close', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'bottom'
      }))
    );
  }

  register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    return of(fakeRegisterResponse).pipe(
      tap((res: RegisterResponse) => this.snackbar.open(`User created successfully`, 'Close', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
      })),
    );
  }

  getLoggedInUser() {
    const decodedToken = this.jwtService.decodeToken();
    return decodedToken.user;
  }

  loggin(loggin: string, password: string) : Observable<Status>{
    const path = 'https://localhost:7242/CheckProfile?login=' + loggin + '&password=' + password;
    return this.http.get<Status>(path);
  }

  reg(login: string, date: string, password: string, isPublic: boolean): Observable<Status> {
    if(isPublic == null){
      isPublic = false;
    }
    const path = 'https://localhost:7242/CreateProfile';
    const data = {
      login: login,
      password: password,
      birth: date,
      isPublic: isPublic
    };
    return this.http.post<Status>(path, data);
  }

  public getFriendsOf(loggin: string) : Observable<Friend[]>{
    const path = 'https://localhost:7242/getForLogin?login=' + loggin;
    return this.http.get<Friend[]>(path);
  }

  public getFriendsSelf(loggin: string) : Observable<Friend[]>{
    const path = 'https://localhost:7242/getForLoginSelf?login=' + loggin;
    return this.http.get<Friend[]>(path);
  }

  sendData(data: string) {
    this.profile = data;
  }

  getData(): String {
    return this.profile;
  }

  public getProfile(loggin: string) : Observable<Profile>{
    const path = 'https://localhost:7242/GetInfoAboutProfile?login=' + loggin;
    return this.http.get<Profile>(path);
  }

  public putProfile(login: string, date: string, password: string, isPublic: boolean): Observable<Status>{
    if(isPublic == null){
      isPublic = false;
    }
    const data = {
      login: login,
      password: password,
      birth: date,
      isPublic: isPublic
    };
    const path = 'https://localhost:7242/UpdateProfile';
    return this.http.put<Status>(path, data);
  }

  public putProfilePassword(login: string, password: string, passwordNew: string): Observable<Status>{
    const data = {
      login: login,
      password: password,
      passwordNew: passwordNew,
    };
    const path = 'https://localhost:7242/UpdateProfilePassword';
    return this.http.put<Status>(path, data);
  }

  public deleteFriend(idFriend: Number): Observable<Status>{
    const path = 'https://localhost:7242/DeleteId/' + idFriend;
    return this.http.delete<Status>(path);
  }

  public changeFriend(friend: Friend): Observable<Status>{
    const path = 'https://localhost:7242/UpdateFriend';
    return this.http.put<Status>(path, friend);
  }

  public addFriend(friend: Friend): Observable<Status>{
    const path = 'https://localhost:7242/CreateFriend';
    return this.http.post<Status>(path, friend);
  }
}
