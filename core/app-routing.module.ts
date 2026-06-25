import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // مسیرهای اصلی را اینجا تعریف کنید
  // { path: '', component: HomeComponent },
  // { path: 'content/:id', component: ContentDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }