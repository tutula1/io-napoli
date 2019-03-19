import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { UtilsService } from "../services/utils.service";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = "";

  validation_messages = {
    email: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Please enter a valid email." },
    ],
    password: [
      { type: "required", message: "Password is required." },
      {
        type: "minlength",
        message: "Password must be at least 5 characters long.",
      },
    ],
  };

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    public utilsService: UtilsService,
    public navCtrl: NavController
  ) {}

  ngOnInit() {
    this.authService.doLogout();
    this.validations_form = this.formBuilder.group({
      email: new FormControl(
        "admin@napoli.coffee",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ]),
      ),
      password: new FormControl(
        "admin123",
        Validators.compose([Validators.minLength(5), Validators.required]),
      ),
    });
  }

  tryLogin(value) {
    this.utilsService.presentLoading();
    this.errorMessage = "";
    this.authService.doLogin(value).then(
      (res) => {
        this.utilsService.dismissLoading();
        if (res) {
          this.navCtrl.navigateRoot('/orders');
        } else {
          this.errorMessage = "Error !!!";
        }
      },
      (err) => {
        this.utilsService.dismissLoading();
        this.errorMessage = err.message;
        console.log(err);
      },
    );
  }

  goRegisterPage() {
    this.router.navigate(["/register"]);
  }
}
