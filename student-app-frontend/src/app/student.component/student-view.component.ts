import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-view',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="container py-4">
    <button class="btn btn-outline-info mb-3" (click)="goBack()">⬅ Back</button>
    <h3>Student Details</h3>
    <div *ngIf="student">
      <p><strong>ID:</strong> {{ student.id }}</p>
      <p><strong>Name:</strong> {{ student.name }}</p>
      <p><strong>Email:</strong> {{ student.email }}</p>
      <p><strong>Enrolled:</strong> {{ student.enrolled ? 'Yes' : 'No' }}</p>
    </div>
  </div>
  `,
})
export class StudentViewComponent {
  student: any;

  constructor(private route: ActivatedRoute, private router: Router) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    this.student = students.find((s: any) => s.id === id);
  }

  goBack() {
    this.router.navigate(['/students']);
  }
}
