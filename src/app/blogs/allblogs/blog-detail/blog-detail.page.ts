import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NavController,
  ModalController,
  ActionSheetController,
  LoadingController,
  AlertController
} from '@ionic/angular';
import { Subscription } from 'rxjs';

import { BlogsService } from '../../blogs.service';
import { Blog } from '../../blog.model';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.page.html',
  styleUrls: ['./blog-detail.page.scss']
})
export class BlogDetailPage implements OnInit, OnDestroy {
  blog: Blog;
  isBookable = false;
  isLoading = false;
  private placeSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private blogsService: BlogsService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.isLoading = true;
      this.placeSub = this.blogsService
        .getPlace(paramMap.get('placeId'))
        .subscribe(
          blog => {
            this.blog = blog;
            this.isBookable = blog.userId !== this.authService.userId;
            this.isLoading = false;
          },
          error => {
            this.alertCtrl
              .create({
                header: 'An error ocurred!',
                message: 'Could not load place.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/blogs/tabs/discover']);
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );
    });
  }

  // onBookPlace() {
  //   // this.router.navigateByUrl('/places/tabs/discover');
  //   // this.navCtrl.navigateBack('/places/tabs/discover');
  //   // this.navCtrl.pop();
  //   this.actionSheetCtrl
  //     .create({
  //       header: 'Choose an Action',
  //       buttons: [
  //         {
  //           text: 'Select Date',
  //           handler: () => {
  //             this.openBookingModal('select');
  //           }
  //         },
  //         {
  //           text: 'Random Date',
  //           handler: () => {
  //             this.openBookingModal('random');
  //           }
  //         },
  //         {
  //           text: 'Cancel',
  //           role: 'cancel'
  //         }
  //       ]
  //     })
  //     .then(actionSheetEl => {
  //       actionSheetEl.present();
  //     });
  // }

  // openBookingModal(mode: 'select' | 'random') {
  //   console.log(mode);
  //   this.modalCtrl
  //     .create({
  //       component: CreateBookingComponent,
  //       componentProps: { selectedPlace: this.blog, selectedMode: mode }
  //     })
  //     .then(modalEl => {
  //       modalEl.present();
  //       return modalEl.onDidDismiss();
  //     })
  //     .then(resultData => {
  //       if (resultData.role === 'confirm') {
  //         this.loadingCtrl
  //           .create({ message: 'Booking place...' })
  //           .then(loadingEl => {
  //             loadingEl.present();
  //             const data = resultData.data.bookingData;
  //             this.bookingService
  //               .addBooking(
  //                 this.blog.id,
  //                 this.blog.title,
  //                 this.blog.imageUrl,
  //                 data.firstName,
  //                 data.lastName,
  //                 data.guestNumber,
  //                 data.startDate,
  //                 data.endDate
  //               )
  //               .subscribe(() => {
  //                 loadingEl.dismiss();
  //               });
  //           });
  //       }
  //     });
  // }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
