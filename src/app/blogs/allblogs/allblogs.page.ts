import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

import { BlogsService } from '../blogs.service';
import { Blog } from '../blog.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-allblogs',
  templateUrl: './allblogs.page.html',
  styleUrls: ['./allblogs.page.scss']
})

export class AllBlogsPage implements OnInit, OnDestroy {
  loadedBlogs: Blog[];
  listedLoadedBlogs: Blog[];
  relevantBlogs: Blog[];
  isLoading = false;
  private blogsSub: Subscription;

  constructor(
    private blogsService: BlogsService,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.blogsSub = this.blogsService.blogs.subscribe(blogs => {
      this.loadedBlogs = blogs;
      this.relevantBlogs = this.loadedBlogs;
      this.listedLoadedBlogs = this.relevantBlogs.slice(1);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.blogsService.fetchBlogs().subscribe(() => {
      this.isLoading = false;
    });
  }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'all') {
      this.relevantBlogs = this.loadedBlogs;
      this.listedLoadedBlogs = this.relevantBlogs.slice(1);
    } else {
      this.relevantBlogs = this.loadedBlogs.filter(
        place => place.userId !== this.authService.userId
      );
      this.listedLoadedBlogs = this.relevantBlogs.slice(1);
    }
  }

  ngOnDestroy() {
    if (this.blogsSub) {
      this.blogsSub.unsubscribe();
    }
  }
}
