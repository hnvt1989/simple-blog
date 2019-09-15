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
  modifiedDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BlogsService {
  private _blogs = new BehaviorSubject<Blog[]>([]);

  get blogs() {
    return this._blogs.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchBlogs() {
    return this.http
      .get<{ [key: string]: BlogData }>(
        'https://qx4ddaiej5.execute-api.us-east-1.amazonaws.com/dev/blogs/all'
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
                  resData[key].userId,
                  new Date(resData[key].modifiedDate)
                )
              );
            }
          }
          return places;
          // return [];
        }),
        tap(blogs => {
          this._blogs.next(blogs);
        })
      );
  }

  fetchMyBlogs(userId: string) {
    return this.http
      .get<{ [key: string]: BlogData }>(
        'https://qx4ddaiej5.execute-api.us-east-1.amazonaws.com/dev/blogs/all'
      )
      .pipe(
        map(resData => {
          const blogs = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key) && resData[key].userId === userId) {
              blogs.push(
                new Blog(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].author,
                  resData[key].content,
                  resData[key].userId,
                  new Date(resData[key].modifiedDate)
                )
              );
            }
          }
          return blogs;
          // return [];
        }),
        tap(blogs => {
          this._blogs.next(blogs);
        })
      );
  }

  getBlog(id: string) {
    return this.http
      .get<BlogData>(
        `https://ionic-angular-course.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map(blogData => {
          return new Blog(
            id,
            blogData.title,
            blogData.description,
            blogData.imageUrl,
            blogData.author,
            blogData.content,
            blogData.userId,
            new Date(blogData.modifiedDate)
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
    const newBlog = new Blog(
      Math.random().toString(),
      title,
      description,
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
      author,
      content,
      this.authService.userId,
      new Date()
    );
    return this.http
      .post<{ name: string }>(
        'https://ionic-angular-course.firebaseio.com/offered-places.json',
        {
          ...newBlog,
          id: null
        }
      )
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.blogs;
        }),
        take(1),
        tap(blogs => {
          newBlog.id = generatedId;
          this._blogs.next(blogs.concat(newBlog));
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

  updateBlog(blogId: string, title: string, description: string, content: string) {
    let updatedBlogs: Blog[];
    return this.blogs.pipe(
      take(1),
      switchMap(blogs => {
        if (!blogs || blogs.length <= 0) {
          return this.fetchBlogs();
        } else {
          return of(blogs);
        }
      }),
      switchMap(blogs => {
        const updatedPlaceIndex = blogs.findIndex(pl => pl.id === blogId);
        updatedBlogs = [...blogs];
        const oldBlog = updatedBlogs[updatedPlaceIndex];
        updatedBlogs[updatedPlaceIndex] = new Blog(
          oldBlog.id,
          title,
          description,
          oldBlog.imageUrl,
          oldBlog.author,
          content,
          oldBlog.userId,
          new Date()
        );
        return this.http.put(
          `https://ionic-angular-course.firebaseio.com/offered-places/${blogId}.json`,
          { ...updatedBlogs[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._blogs.next(updatedBlogs);
      })
    );
  }
}
