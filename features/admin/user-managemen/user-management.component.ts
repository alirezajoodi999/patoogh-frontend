import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface User {
  id: string;
  email: string;
  full_name: string;
  // نقش‌های پاتوق - صفحه ۱۵ مستندات
  role: 'admin' | 'hr_admin' | 'manager';
  is_active: boolean;
  created_at: string;
  last_login?: string;
  department?: string;
  position?: string;
}

interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  error: string | null = null;
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalUsers = 0;
  totalPages = 0;
  
  // Filters
  searchTerm = '';
  roleFilter: string = 'all';
  statusFilter: string = 'all';
  
  // Modal state
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  selectedUser: User | null = null;
  
  // Form
  userForm: FormGroup;
  
  // نقش‌های سیستم پاتوق (صفحه ۱۵ مستندات)
  roles = [
    { value: 'admin',    label: 'ادمین فنی' },
    { value: 'hr_admin', label: 'ادمین آموزش و توسعه' },
    { value: 'manager',  label: 'مدیر سازمان' }
  ];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.minLength(8)]],
      role: ['manager', Validators.required],
      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    
    const params: any = {
      page: this.currentPage,
      limit: this.pageSize
    };
    
    if (this.roleFilter !== 'all') {
      params.role = this.roleFilter;
    }
    
    if (this.statusFilter !== 'all') {
      params.is_active = this.statusFilter === 'active';
    }
    
    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.http.get<UserListResponse>(`${environment.apiUrl}/admin/users`, {
      headers: this.getHeaders(),
      params
    }).subscribe({
      next: (response) => {
        this.users = response.users;
        this.filteredUsers = response.users;
        this.totalUsers = response.total;
        this.totalPages = Math.ceil(this.totalUsers / this.pageSize);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'خطا در بارگذاری لیست کاربران';
        console.error('Error loading users:', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.roleFilter = 'all';
    this.statusFilter = 'all';
    this.currentPage = 1;
    this.loadUsers();
  }

  openAddModal(): void {
    this.modalMode = 'add';
    this.selectedUser = null;
    this.userForm.reset({
      role: 'manager',
      is_active: true
    });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showModal = true;
  }

  openEditModal(user: User): void {
    this.modalMode = 'edit';
    this.selectedUser = user;
    this.userForm.patchValue({
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      is_active: user.is_active
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedUser = null;
    this.userForm.reset();
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const formData = this.userForm.value;
    
    // Remove password if empty in edit mode
    if (this.modalMode === 'edit' && !formData.password) {
      delete formData.password;
    }

    const request = this.modalMode === 'add'
      ? this.http.post(`${environment.apiUrl}/admin/users`, formData, { headers: this.getHeaders() })
      : this.http.put(`${environment.apiUrl}/admin/users/${this.selectedUser?.id}`, formData, { headers: this.getHeaders() });

    request.subscribe({
      next: () => {
        this.closeModal();
        this.loadUsers();
        this.loading = false;
      },
      error: (err) => {
        this.error = this.modalMode === 'add' ? 'خطا در افزودن کاربر' : 'خطا در ویرایش کاربر';
        console.error('Error saving user:', err);
        this.loading = false;
      }
    });
  }

  toggleUserStatus(user: User): void {
    if (!confirm(`آیا از ${user.is_active ? 'غیرفعال' : 'فعال'} کردن کاربر ${user.full_name} اطمینان دارید؟`)) {
      return;
    }

    this.http.patch(`${environment.apiUrl}/admin/users/${user.id}/status`, 
      { is_active: !user.is_active },
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        this.error = 'خطا در تغییر وضعیت کاربر';
        console.error('Error toggling user status:', err);
      }
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`آیا از حذف کاربر ${user.full_name} اطمینان دارید؟ این عملیات قابل بازگشت نیست.`)) {
      return;
    }

    this.http.delete(`${environment.apiUrl}/admin/users/${user.id}`, {
      headers: this.getHeaders()
    }).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        this.error = 'خطا در حذف کاربر';
        console.error('Error deleting user:', err);
      }
    });
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadUsers();
  }

  getRoleLabel(role: string): string {
    return this.roles.find(r => r.value === role)?.label || role;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}
