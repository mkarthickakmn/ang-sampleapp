import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../login/auth.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  constructor(private auth:AuthService) { }
  user:any=null;
  image:any;
  ngOnInit(): void {

    this.user=this.auth.getUser();
    console.log(this.user);
    if(this.user)
      this.image=this.user.image;
  
  }

}
