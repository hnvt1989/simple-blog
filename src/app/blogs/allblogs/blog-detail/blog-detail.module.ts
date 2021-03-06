import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BlogDetailPage } from './blog-detail.page';
//import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

const routes: Routes = [
  {
    path: '',
    component: BlogDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  //declarations: [BlogDetailPage, CreateBookingComponent],
  //entryComponents: [CreateBookingComponent]
  declarations: [BlogDetailPage],
  entryComponents: []
})
export class BlogDetailPageModule {}
