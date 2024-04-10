import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  apiUrl = 'https://mvru6jjqj3.execute-api.us-east-2.amazonaws.com/prod/api/';
  uidCompany = 'af3d3098-3000-4d6f-8331-e68989fe0642';

  constructor(private http: HttpClient) {}

  async getPrice() {
    try {
      const response = await this.http.get(
        `${this.apiUrl}company/getPricePerKilo?uid=%22${this.uidCompany}%22`
      );
      return response;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async updatePrice(price: number) {
    try {
      const response = await this.http.put(
        `${this.apiUrl}company/updatePricePerKilo`,
        {
          uid: this.uidCompany,
          pricePerKilo: price,
        }
      );
      return response;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async getRecordsByDate(initDate: string, endDate: string) {
    try {
      const response = await this.http.get(
        `${this.apiUrl}record/getRecordByDates?uidCompany=%22${this.uidCompany}%22&initDate=%22${initDate}%22&endDate=%22${endDate}%22`
      );
      return response;
    } catch (error) {
      console.error(error);
      return;
    }
  }
}
