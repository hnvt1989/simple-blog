import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BlogsPage } from './blogs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: BlogsPage,
    children: [
      {
        path: 'allblogs',
        children: [
          {
            path: '',
            loadChildren: './blogs.module#BlogsPageModule'
          },
          {
            path: ':blogId',
            loadChildren:
              './allblogs/blog-detail/blog-detail.module#BlogDetailPageModule'
          }
        ]
      },
      {
        path: 'myblogs',
        children: [
          // {
          //   path: '',
          //   loadChildren: './myblogs/myblogs.module#OffersPageModule'
          // },
          // {
          //   path: 'new',
          //   loadChildren:
          //     './myblogs/new-blog/new-blog.module#NewBlogPageModule'
          // },
          // {
          //   path: 'edit/:blogId',
          //   loadChildren:
          //     './myblogs/edit-blog/edit-blog.module#EditBlogPageModule'
          // }
        ]
      },
      {
        path: '',
        redirectTo: '/blogs/tabs/allblogs',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/blogs/tabs/allblogs',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogsRoutingModule {}
