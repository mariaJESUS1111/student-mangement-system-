import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FilterPipe } from '../filter.pipe';
import * as bootstrap from 'bootstrap';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-student',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, FilterPipe],
    templateUrl: './student.component.html',
    styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
    apiUrl = environment.apiUrl;
    students: any[] = [];
    studentForm!: FormGroup;
    showForm = false;
    editMode = false;
    selectedFile: File | null = null;
    searchTerm = '';
    selectedStudent: any = null;
    userName = localStorage.getItem('userName') || '';

    cities = ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta'];
    classes = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'];
    genders = ['Male', 'Female'];

    constructor(private fb: FormBuilder, private http: HttpClient) { }

    ngOnInit(): void {
        this.loadStudents();
        this.initForm();
    }

    initForm() {
        this.studentForm = this.fb.group({
            id: [0],
            // Requirement: Name must be 3-50 letters only and is required
            name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]{3,50}$/)]],
            // Requirement: National ID must be 14 digits
            nationalId: ['', [Validators.pattern(/^\d{14}$/)]],
            birthdate: ['', Validators.required],
            address: [''],
            city: ['', Validators.required],
            class: ['', Validators.required],
            gender: ['', Validators.required],
            enrolled: [false],
            remarks: [''],
            documentPath: ['']
        });
    }

    // Load all students
    loadStudents() {
        this.http.get<any[]>(this.apiUrl).subscribe({
            next: (res) => (this.students = res),
            error: (err) => console.error('Error loading students', err)
        });
    }

    // Toggle Add/Edit form
    toggleForm() {
        this.showForm = !this.showForm;
        this.editMode = false;
        this.studentForm.reset({ enrolled: false });
    }

    // File upload
    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    }

    // Save Student (add or update) - FIX IMPLEMENTED HERE
    saveStudent() {
        if (this.studentForm.invalid) {
            Object.keys(this.studentForm.controls).forEach(field => {
                const control = this.studentForm.get(field);
                control?.markAsTouched({ onlySelf: true });
            });
            return;
        }

        const formData = new FormData();

        // Iterate over form values and append
        Object.entries(this.studentForm.value).forEach(([key, value]) => {
            // CRITICAL FIX: Skip the 'id' field when adding a new student (POST request)
            if (!this.editMode && key === 'id') {
                return;
            }

            // Append all other values
            if (value !== null && value !== undefined) {
                formData.append(key, value as any);
            }
        });

        if (this.selectedFile) formData.append('file', this.selectedFile);

        const request$ = this.editMode
            ? this.http.put(`${this.apiUrl}/${this.studentForm.value.id}`, formData)
            : this.http.post(this.apiUrl, formData);

        request$.subscribe({
            next: () => {
                alert(this.editMode ? 'Student updated successfully' : 'Student added successfully');
                this.loadStudents();
                this.studentForm.reset({ enrolled: false });
                this.selectedFile = null;
                this.showForm = false;
            },
            error: (err) => console.error('Error saving student', err)
        });
    }

    editStudent(student: any) {
        this.showForm = true;
        this.editMode = true;
        this.studentForm.patchValue(student);
    }

    deleteStudent(id: number) {
        if (confirm('Are you sure you want to delete this student?')) {
            this.http.delete(`${this.apiUrl}/${id}`).subscribe({
                next: () => {
                    alert('Student deleted successfully');
                    this.loadStudents();
                },
                error: (err) => console.error('Error deleting student', err)
            });
        }
    }

    cancelForm() {
        this.showForm = false;
        this.studentForm.reset();
    }

    // Modal view
    viewStudent(student: any) {
        this.selectedStudent = student;
        const modalElement = document.getElementById('viewModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }

    logout() {
        localStorage.clear();
        window.location.href = '/login';
    }
}
