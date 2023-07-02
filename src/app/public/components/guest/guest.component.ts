import { Component} from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';
import { Friend } from '../../interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss']
})
export class GuestComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  loginForm: FormGroup = new FormGroup({
    login: new FormControl(null, [Validators.required])
  });


  isExist: boolean = true;
  friends: Friend[] = [];

  showList(){
    this.friends = [];
    this.authService.getFriendsOf(this.loginForm.controls['login'].value).subscribe((result: Friend[]) => {
      if(result.length == 0){
        this.isExist = false;
      }
      else{
        this.isExist = true;
        this.friends = result;
      }
    });
  }

  getColor(remains: number): string {
    const percentage = (remains / 366) * 100;
    const hue = ((100 - percentage) * 120) / 100;
    return `hsl(${hue}, 100%, 50%)`;
  }

}
