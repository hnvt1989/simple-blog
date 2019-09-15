import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NavController,
  LoadingController,
  AlertController
} from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { BlogsService } from '../../blogs.service';
import { Blog } from '../../blog.model';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.page.html',
  styleUrls: ['./edit-blog.page.scss']
})
export class EditBlogPage implements OnInit, OnDestroy {
  blog: Blog;
  placeId: string;
  form: FormGroup;
  isLoading = false;
  private blogSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private blogsService: BlogsService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.blogSub = this.blogsService
        .getBlog(paramMap.get('placeId'))
        .subscribe(
          blog => {
            this.blog = blog;
            this.form = new FormGroup({
              title: new FormControl(this.blog.title, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              description: new FormControl(this.blog.description, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(180)]
              })
            });
            this.isLoading = false;
          },
          error => {
            this.alertCtrl
              .create({
                header: 'An error occurred!',
                message: 'Place could not be fetched. Please try again later.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/myblogs/tabs/allblogs']);
                    }
                  }
                ]
              })
              .then(alertEl => {
                alertEl.present();
              });
          }
        );
    });
  }

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Updating blog...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.blogsService
          .updateBlog(
            this.blog.id,
            this.form.value.title,
            this.form.value.description,
            this.form.value.content
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/places/tabs/offers']);
          });
      });
  }

  ngOnDestroy() {
    if (this.blogSub) {
      this.blogSub.unsubscribe();
    }
  }
}
