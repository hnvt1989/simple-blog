import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { Blog } from './blog.model';
import { AuthService } from '../auth/auth.service';

// [
//   new Place(
//     'p1',
//     'Manhattan Mansion',
//     'In the heart of New York City.',
//     'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
//     149.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p2',
//     "L'Amour Toujours",
//     'A romantic place in Paris!',
//     'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg',
//     189.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p3',
//     'The Foggy Palace',
//     'Not your average city trip!',
//     'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
//     99.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   )
// ]

interface BlogData {
  imageUrl: string;
  author: string;
  description: string;
  content: string;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogsService {
  private _places = new BehaviorSubject<Blog[]>([]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: BlogData }>(
        'https://ionic-angular-course.firebaseio.com/offered-places.json'
      )
      .pipe(
        map(resData => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Blog(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].author,
                  resData[key].content,
                  resData[key].userId
                )
              );
            }
          }
          return places;
          // return [];
        }),
        tap(places => {
          this._places.next(places);
        })
      );
  }

  getPlace(id: string) {
    return this.http
      .get<BlogData>(
        `https://ionic-angular-course.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map(placeData => {
          return new Blog(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.author,
            placeData.content,
            placeData.userId
          );
        })
      );
  }

  addBlog(
    title: string,
    description: string,
    author,
    content
  ) {
    let generatedId: string;
    const newPlace = new Blog(
      Math.random().toString(),
      title,
      description,
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
      author,
      content,
      this.authService.userId
    );
    return this.http
      .post<{ name: string }>(
        'https://ionic-angular-course.firebaseio.com/offered-places.json',
        {
          ...newPlace,
          id: null
        }
      )
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(places => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  updateBlog(placeId: string, title: string, description: string, content: string) {
    let updatedPlaces: Blog[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Blog(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.author,
          content,
          oldPlace.userId
        );
        return this.http.put(
          `https://ionic-angular-course.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
