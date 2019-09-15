import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { BlogsService } from '../blogs.service';
import { Blog } from '../blog.model';

@Component({
  selector: 'app-myblogs',
  templateUrl: './myblogs.page.html',
  styleUrls: ['./myblogs.page.scss']
})
export class MyBlogsPage implements OnInit, OnDestroy {
  blogs: Blog[];
  isLoading = false;
  private blogsSub: Subscription;

  constructor(private blogsService: BlogsService, private router: Router) {}

  ngOnInit() {
    this.blogsSub = this.blogsService.blogs.subscribe(blogs => {
      this.blogs = blogs;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    const userId = 'user_432423hoguga';
    this.blogsService.fetchMyBlogs(userId).subscribe(() => {
      this.isLoading = false;
    });
  }

  onEdit(blogId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'blogs', 'tabs', 'myblogs', 'edit', blogId]);
    console.log('Editing item', blogId);
  }

  ngOnDestroy() {
    if (this.blogsSub) {
      this.blogsSub.unsubscribe();
    }
  }
}
