import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { BlogsPage } from './blogs.page';
import { BlogsRoutingModule } from './blogs-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    BlogsRoutingModule
  ],
  declarations: [BlogsPage]
})
export class BlogsPageModule {}
