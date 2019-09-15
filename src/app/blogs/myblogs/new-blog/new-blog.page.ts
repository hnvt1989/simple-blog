import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { BlogsService } from '../../blogs.service';

@Component({
  selector: 'app-new-blog',
  templateUrl: './new-blog.page.html',
  styleUrls: ['./new-blog.page.scss']
})

export class NewBlogPage implements OnInit {
  form: FormGroup;

  constructor(
    private blogsService: BlogsService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onCreateBlog() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Creating blog...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.blogsService
          .addBlog(
            this.form.value.title,
            this.form.value.description,
            this.form.value.author,
            this.form.value.content
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/blogs/tabs/myblogs']);
          });
      });
  }
}
