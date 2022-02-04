import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LookUp } from 'app/core/models/lookUp';
import { AlertifyService } from 'app/core/services/alertify.service';
import { LocalStorageService } from 'app/core/services/local-storage.service';
import { environment } from 'environments/environment';
import { LoginUser } from './model/login-user';
import { RegisterUser } from './model/register-user';
import { AuthService } from './services/auth.service';

declare var jQuery: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username:string="";
  loginUser:LoginUser=new LoginUser();
  langugelookUp:LookUp[];
  registerAddForm: FormGroup;
  registerUser:RegisterUser =new RegisterUser()


  constructor(private auth:AuthService,
    private storageService:LocalStorageService,
    public translateService:TranslateService,
    private httpClient:HttpClient,
    private formBuilder: FormBuilder,
    private alertifyService:AlertifyService) { }

  ngOnInit() {

    this.username=this.auth.userName;

    this.httpClient.get<LookUp[]>(environment.getApiUrl +"/languages/getlookupwithcode").subscribe(data=>{
      this.langugelookUp=data;
    })

    this.createRegisterAddForm();
    
  }

  getUserName(){
    return this.username;
  }

  login(){
    this.auth.login(this.loginUser);
  }

  logOut(){
      this.storageService.removeToken();
      this.storageService.removeItem("lang");
  }

  changeLang(lang){  
    localStorage.setItem("lang",lang);
    this.translateService.use(lang);
  }

  createRegisterAddForm() {
		this.registerAddForm = this.formBuilder.group({
			email: ["",Validators.required],
			password: ["",Validators.required],
			fullName: ["",Validators.required]
		})
	}

  save(){

    if (this.registerAddForm.valid) {
      this.registerUser = Object.assign({}, this.registerAddForm.value)

      this.register();

    }

  }

  register(){
    this.httpClient.post(environment.getApiUrl +"/Auth/register", this.registerUser, { responseType: 'text' }).subscribe(data=>{
      debugger;
      jQuery("#register").modal("hide");
      this.alertifyService.success("Kayıt Başarılı");
      this.clearFormGroup(this.registerAddForm);
    })
  }

  clearFormGroup(register: FormGroup) {

    register.markAsUntouched();
    register.reset();

    Object.keys(register.controls).forEach(key => {
      register.get(key).setErrors(null);
      if (key == "id")
      register.get(key).setValue(0);
    });
  }

  

}
