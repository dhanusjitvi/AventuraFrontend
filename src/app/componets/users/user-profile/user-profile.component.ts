import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  profileEditingForm!: FormGroup;
  data = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
  };
  private _id: any;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Initialize the form group and form controls
    this.profileEditingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/)]],
    });

    this._id = localStorage.getItem('userId');

    this.http
      .get<any>(`http://localhost:5000/editprofile/${this._id}`)
      .subscribe(
        (res: any) => {
          this.data.firstName = res.firstName;
          this.data.lastName = res.lastName;
          this.data.phone = res.phone;
          this.data.email = res.email;
          this.data.address = res.address;

          this.profileEditingForm.patchValue({
            firstName: this.data.firstName,
            lastName: this.data.lastName,
            email: this.data.email,
            phone: this.data.phone,
            address: this.data.address,
          });
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  onSubmit(): void {
    if (this.profileEditingForm.valid) {
      const formData = this.profileEditingForm.value;

      this.http.put<any>(`http://localhost:5000/updateprofile/${this._id}`, formData).subscribe(
        (res: any) => {
          console.log(res);
          // Handle the response from the backend as needed
          this.router.navigate(['/home']); // Optionally, navigate to another page after successful update
        },
        (error: any) => {
          console.error(error);
          // Handle the error here (e.g., display an error message)
        }
      );
    }
  }
}
