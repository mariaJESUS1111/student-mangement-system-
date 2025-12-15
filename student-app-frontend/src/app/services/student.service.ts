import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Student {
  id?: number;
  name: string;
  nationalId?: string;
  birthdate: string;
  address?: string;
  scannedDocument?: string;
  city: string;
  class?: string;
  gender: string;
  enrolled?: boolean;
  remarks?: string;
}

@Injectable({ providedIn: 'root' })
export class StudentService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.api);
  }

  getById(id: number) {
    return this.http.get<Student>(`${this.api}/${id}`);
  }

  create(formData: FormData) {
    return this.http.post<Student>(this.api, formData);
  }

  update(id: number, formData: FormData) {
    return this.http.put<void>(`${this.api}/${id}`, formData);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  downloadFile(id: number) {
    return this.http.get(`${this.api}/${id}/file`, { responseType: 'blob' });
  }
}
