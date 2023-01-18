import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../service/user-auth.service';
import Swal from 'sweetalert2';
import{FormGroup,FormControl,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { stringify } from 'querystring';

@Component({
  selector: 'ngx-otp-page',
  templateUrl: './otp-page.component.html',
  styleUrls: ['./otp-page.component.scss']
})
export class OtpPageComponent implements OnInit {
   isactive=false
 email=''
  constructor(private userServ: UserAuthService,private router:Router) { }
  id!: string;
  ngOnInit(): void{

   this.userServ.subject.subscribe((res:any)=>{
      let data=res.otpData;
     this.id = data;
     
   }) 

   
  }
  move(e: any,p:any,c:any,n:any)
  {
    var length = c.value.length;
    var maxlength = c.getAttribute('maxlength');
    if (length == maxlength)
    {
      n.focus();
    }
    if (e.key == 'Backspace')
    {
      p.focus();
      }
  }
  
  myForm = new FormGroup({
    t1: new FormControl('', [Validators.required]),
    t2: new FormControl('', [Validators.required]),
  t3:new FormControl('',[Validators.required]),
  t4:new FormControl('',[Validators.required]),
  t5:new FormControl('',[Validators.required]),
  // otp:new FormControl('',[Validators.required,Validators.pattern('[0-9]{ ,6}')]),
  })
  submit(): void {
   
    this.userServ.getuserByid(this.id).subscribe((res: any) => {
      this.email = res.email
    })
      console.log(this.id)
    let formdata = this.myForm.getRawValue();
    let t1 = formdata.t1;
    let t2 = formdata.t2;
    let t3 = formdata.t3;
    let t4 = formdata.t4;
    let t5 = formdata.t5;
   
    let otp=t1+t2+t3+t4+t5
    // console.log(otp);  
    // console.log(this.id)
    let data = { "otp": otp, "id": this.id }
  
    
    this.userServ.postotp(data).subscribe((res:any) => {
      if (res.err == 0) {
        Swal.fire(`${res.msg}`, '', 'success')
       
     
        this.router.navigate(['/pages/ui-features/login']).then(() => {
               window.location.reload();
            })
        
      }
      if (res.err == 1) {
        this.isactive = res.active;
        Swal.fire(`${res.msg}`,'','warning')
        
      }
    })
   

  
  }

  //Resend otp
  resend()
  {
   
    console.log(this.email);
    let data = { 'email': this.email }
    console.log(data)
    this.userServ.resendotp(data).subscribe((res: any) =>{
       if (res.err == 0) {
        Swal.fire(`${res.msg}`,'','success') 
      } 
    
  if (res.err == 1) {
        Swal.fire(`${res.msg}`,'','warning') 
      } 
     })
  }
  
}



