import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { UtilsService } from '../services/utils.service';

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = "";
  successMessage: string = "";

  validation_messages = {
    name: [
      { type: "required", message: "Password is required." },
      {
        type: "minlength",
        message: "Password must be at least 3 characters long.",
      },
    ],
    email: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Enter a valid email." },
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
  ) {}

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      name: new FormControl(
        "ADMIN",
        Validators.compose([Validators.minLength(3), Validators.required]),
      ),
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

  tryRegister(value) {
    this.utilsService.presentLoading();
    this.authService.doRegister(value).then(
      (user) => {
        this.utilsService.dismissLoading();
        this.errorMessage = "";
        this.successMessage = "Your account has been created. Please log in.";
      },
      (err) => {
        this.utilsService.dismissLoading();
        this.errorMessage = err.message;
        this.successMessage = "";
      },
    );
  }

  goLoginPage() {
    this.router.navigate(["/login"]);
  }
}
