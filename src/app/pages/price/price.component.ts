import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DbService } from '../../services/db.service';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-price',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './price.component.html',
  styleUrl: './price.component.css',
})
export class PriceComponent implements OnInit {
  priceInput = new FormControl(0, [Validators.required, Validators.min(0)]);

  constructor(private routes: Router, private dbService: DbService) {}

  ngOnInit(): void {
    this.getPrice();
  }

  handleLogout() {
    this.routes.navigate(['/login']);
  }

  async getPrice() {
    try {
      const response = await this.dbService.getPrice();
      if (response) {
        const res: any = await lastValueFrom(response);
        this.priceInput.setValue(res.body.pricePerKilo);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async handleUpdatePrice() {
    if (this.priceInput.invalid) {
      Swal.fire('Error', 'Price must be greater than 0', 'error');
      return;
    }
    Swal.fire({
      title: 'Updating price',
      text: 'Please wait',
      showConfirmButton: false,
      willOpen() {
        Swal.showLoading();
      },
    });
    await this.updatePrice();
    Swal.fire({
      title: 'Success',
      text: 'Price updated successfully',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
  }

  async updatePrice() {
    try {
      const response = await this.dbService.updatePrice(this.priceInput.value!);
      if (response) {
        const res: any = await lastValueFrom(response);
        console.log(res);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
