import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router,
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Check if user is authenticated first
    if (!this.authService.isAuthenticated || !this.authService.currentUserValue) {
      console.warn('دسترسی غیرمجاز - لطفاً وارد شوید');
      return this.router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url }
      });
    }

    // Get allowed roles from route data
    const allowedRoles = route.data['roles'] as UserRole[];
    
    if (!allowedRoles || allowedRoles.length === 0) {
      // No role restriction, allow access
      return true;
    }

    // Check if user has required role
    const userRole = this.authService.currentUserRole;
    
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // User doesn't have required role
    console.warn('دسترسی ممنوع - شما مجوز دسترسی به این بخش را ندارید');
    return this.router.createUrlTree(['/dashboard']);
  }
}
