import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DbService } from '../../services/db.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
  excelData: any[] = [];
  initDate = new FormControl('', Validators.required);
  endDate = new FormControl('', Validators.required);

  constructor(private routes: Router, private DBService: DbService) {}

  ngOnInit(): void {
    console.log('Reports');
  }

  handleLogout() {
    this.routes.navigate(['/login']);
  }

  async handleGetRecords() {
    if (this.initDate.invalid || this.endDate.invalid) {
      Swal.fire('Error', 'Please select a valid date', 'error');
      return;
    }
    Swal.fire({
      title: 'Getting records',
      text: 'Please wait',
      showConfirmButton: false,
      willOpen() {
        Swal.showLoading();
      },
    });
    await this.getRecords();
    await this.exportToExcel();
    await Swal.fire({
      title: 'Success',
      text: 'Records retrieved successfully',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
  }

  async getRecords() {
    try {
      const response = await this.DBService.getRecordsByDate(
        this.initDate.value!,
        this.endDate.value!
      );
      if (response) {
        const res: any = await lastValueFrom(response);
        console.log(res);
        this.excelData = res.body;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async exportToExcel(): Promise<void> {
    try {
      const modifiedData = this.calculateSalesPerDay();
      const buffer = await this.generateExcelBuffer(modifiedData);
      this.saveAsExcelFile(buffer, 'excelFileName');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  }

  private calculateSalesPerDay(): any[] {
    const salesPerDayMap = new Map<string, number>();
    let totalSales = 0;

    this.excelData.forEach((item) => {
      const date = item.creationDate;
      const price = parseFloat(item.price);
      const sales = parseInt(item.tortillas);

      totalSales += price;

      if (salesPerDayMap.has(date)) {
        salesPerDayMap.set(date, salesPerDayMap.get(date)! + price);
      } else {
        salesPerDayMap.set(date, price);
      }
    });

    // Convert map to array of objects
    const salesPerDayArray = Array.from(salesPerDayMap, ([date, sales]) => ({
      date,
      sales,
    }));
    const totalSalesObject = { date: 'Total', sales: totalSales };

    return [...salesPerDayArray, totalSalesObject];
  }

  private async generateExcelBuffer(modifiedData: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const worksheet: XLSX.WorkSheet =
          XLSX.utils.json_to_sheet(modifiedData);
        const workbook: XLSX.WorkBook = {
          Sheets: { data: worksheet },
          SheetNames: ['data'],
        };
        const excelBuffer: any = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        });
        resolve(excelBuffer);
      } catch (error) {
        reject(error);
      }
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = window.URL.createObjectURL(data);
    a.download = fileName + '.xlsx';
    a.click();
  }
}
