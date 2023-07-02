import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LOCALSTORAGE_TOKEN_KEY } from 'src/app/app.module';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { Friend, Profile, Status } from 'src/app/public/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/public/custom-validator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
  ) {}

//#region FormDroups
  registerForm = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    isPublic: new FormControl(null),
    password: new FormControl(null, [Validators.required]),
  });

  passwordChangeForm = new FormGroup({
    password: new FormControl(null, [Validators.required]),
    passwordNew1: new FormControl(null, [Validators.required]),
    passwordNew2: new FormControl(null, [Validators.required])
  },
  { validators: CustomValidators.passwordsNewMatching }
  );

  friendChangeForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    surname: new FormControl(null, [Validators.required]),
    date: new FormControl(null, [Validators.required])
  });

  friendCreateForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    surname: new FormControl(null, [Validators.required]),
    date: new FormControl(null, [Validators.required])
  });

  findNameForm = new FormGroup({
    name: new FormControl(null)
  });
  //#endregion

  public profile: Profile | undefined;
  public friends: Friend[] = [];
  public showFriendsList: boolean = true;
  public showChangePassword: boolean = true;
  public settings: string = "Settings";
  public showFriendPanel: Friend | undefined;
  public isChangeFriend: boolean = false;
  public isGuest: boolean = false;
  public fieldGuest: string = "Guest";
  public showCreateFrieadnPanel: boolean = false;
  public status: Status = { status: true };

  logout() {
    localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
    this.router.navigate(['../../']);
  }

  ngOnInit() {
    this.friends = [];
    let tmp = new String();
    this.route.queryParams.subscribe(params => {
      tmp = params['login']
    })
    this.authService.getProfile(tmp.toString()).subscribe((result: Profile) => {
      this.profile = result;
      this.registerForm.controls['date'].setValue(this.profile?.birth)
      this.registerForm.controls['isPublic'].setValue(this.profile?.isPublic)
      this.registerForm.controls['password'].setValue('')
      this.getFriends()
    });
    this.getColor(1);
  }

  getFriends(){
    if(this.profile != undefined)
    this.authService.getFriendsSelf(this.profile.login).subscribe((result: Friend[]) => {
      this.friends = result;
    })
  }

  getColor(remains: number): string {
    const percentage = (remains / 366) * 100;
    const hue = ((100 - percentage) * 120) / 100;
    return `hsl(${hue}, 100%, 50%)`;
  }

  //#region toogle
  toggleFriendsList(): void {
    this.showFriendsList = !this.showFriendsList;
    this.setButton();
  }

  toggleChangePassword(): void {
    this.showChangePassword = !this.showChangePassword;
  }

  toogleChangeGuest(): void {
    this.isGuest = !this.isGuest;
    if(this.isGuest){
      this.fieldGuest = "Profile";
    } else {
      this.fieldGuest = "Guest";
      this.ngOnInit();
    }
  }

  toogleshowCreateFrieadnPanel(): void {
    this.showCreateFrieadnPanel = !this.showCreateFrieadnPanel;
    if(!this.showCreateFrieadnPanel){
      this.ngOnInit();
    }
  }

  toggleChangeFriend():void {
    this.isChangeFriend = !this.isChangeFriend;
    if(this.isChangeFriend && this.showFriendPanel != undefined){
      this.friendChangeForm.controls['name'].setValue(this.showFriendPanel.name)
      this.friendChangeForm.controls['surname'].setValue(this.showFriendPanel.surname)
      this.friendChangeForm.controls['date'].setValue(this.showFriendPanel.birth)
    }
    else{
      this.friendChangeForm.controls['name'].setValue('')
      this.friendChangeForm.controls['surname'].setValue('')
      this.friendChangeForm.controls['date'].setValue('')
    }
  }

  setButton(): void{
    if(this.settings == "Settings"){
      this.settings = "List"
    }
    else{
      this.settings ="Settings"
    }
  }

  onMouseOver(friend: any) {
    this.showFriendPanel = friend;
    if (this.showFriendPanel?.name === 'Me') {
      this.showFriendPanel = undefined;
    }
  }

  onMouseLeave() {
    this.showFriendPanel = undefined;
  }

  //#endregion

  changeProfile(): void {
    if (!this.registerForm.valid) {
      return;
    }
    if(this.profile != null)
    this.authService.putProfile(
      this.profile?.login,
      this.registerForm.controls['date'].value,
      this.registerForm.controls['password'].value,
      this.registerForm.controls['isPublic'].value).subscribe((result: Status) => {
        this.status = result;
        if(this.status?.status){
          this.ngOnInit();
          this.toggleFriendsList();
          this.snackbar.open(`Profile changed successfully`, 'Close', {
            duration: 2000, horizontalPosition: 'right', verticalPosition: 'bottom'
          })
        } else {
          return;
        }
      })
  }

  changePassword(): void{
    if(this.profile != null)
    this.authService.putProfilePassword(
      this.profile?.login,
      this.passwordChangeForm.controls['password'].value,
      this.passwordChangeForm.controls['passwordNew2'].value).subscribe((result: Status) => {
        this.status = result;
        if(this.status?.status){
          this.ngOnInit();
          this.toggleFriendsList();
          this.toggleChangePassword();
          this.snackbar.open(`Password changed successfully`, 'Close', {
            duration: 2000, horizontalPosition: 'right', verticalPosition: 'bottom'
          })
        } else {
          return;
        }
      })
  }



  deleteFriend(): void{
    if(this.showFriendPanel != null){
      this.authService.deleteFriend(this.showFriendPanel?.id).subscribe((result: Status) => {
        this.status = result;
        if(this.status?.status){
          this.ngOnInit();
          this.snackbar.open('Friend ' + this.showFriendPanel?.name +  ' deleted successfully', 'Close', {
            duration: 2000, horizontalPosition: 'right', verticalPosition: 'bottom'
          })
        }
        else{
          return;
        }
      });
    }
  }

  changeFriend(): void{
    if(this.showFriendPanel != null){
      let friend: Friend = {
        id: this.showFriendPanel.id,
        name: this.friendChangeForm.controls['name'].value,
        surname: this.friendChangeForm.controls['surname'].value,
        birth: this.friendChangeForm.controls['date'].value,
        remains: this.showFriendPanel.remains
        }
      this.authService.changeFriend(friend).subscribe((result: Status) => {
        this.status = result;
        if(this.status?.status){
          this.toggleChangeFriend();
          this.ngOnInit();
          this.snackbar.open('Friend ' + friend.name +  ' changed successfully', 'Close', {
            duration: 2000, horizontalPosition: 'right', verticalPosition: 'bottom'
          })
        }
      })
    };
  }

  createFriend(): void{
    if(this.profile != undefined){
      let friend: Friend = {
        id: this.profile.id,
        name: this.friendCreateForm.controls['name'].value,
        surname: this.friendCreateForm.controls['surname'].value,
        birth: this.friendCreateForm.controls['date'].value,
        remains: 0
        }
      this.authService.addFriend(friend).subscribe((result: Status) => {
        this.status = result;
        if(this.status?.status){
          this.toogleshowCreateFrieadnPanel();
          this.ngOnInit();
          this.friendCreateForm.controls['name'].setValue('')
          this.friendCreateForm.controls['surname'].setValue('')
          this.friendCreateForm.controls['date'].setValue('')
          this.snackbar.open('Friend ' + friend.name +  ' created successfully', 'Close', {
            duration: 2000, horizontalPosition: 'right', verticalPosition: 'bottom'
          })
        }
      })
    };
  }

  searchFrieand(): void{
    if(this.findNameForm.controls['name'].value === null || this.findNameForm.controls['name'].value === ''){
        this.getFriends()
    }
    else{
      if(this.profile != undefined)
        this.authService.getFriendsSelf(this.profile.login).subscribe((result: Friend[]) => {
          this.friends = result;
          this.friends = this.friends.filter(f => f.name == this.findNameForm.controls['name'].value)
        })
    }
  }



//#region Search
  loginForm: FormGroup = new FormGroup({
    login: new FormControl(null, [Validators.required])
  });

  isExist: boolean = true;
  friendsGuest: Friend[] = [];

  showList(){
    this.friends = [];
    this.authService.getFriendsOf(this.loginForm.controls['login'].value).subscribe((result: Friend[]) => {
      if(result.length == 0){
        this.isExist = false;
      }
      else{
        this.isExist = true;
        this.friendsGuest = result;
      }
    });
  }

  //#endregion
}
