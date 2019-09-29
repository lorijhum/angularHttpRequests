import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

export class PostsService{
    error = new Subject<string>();

    constructor(private http: HttpClient) {}

    createAndStorePost(title: string, content: string) {
        const postData: Post = {title: title, content: content}
        this.http
        .post<{ name: string }>(
          'https://ng-complete-guide-c111d.firebaseio.com/posts.json',
          postData
        )
        .subscribe(responseData => {
          console.log(responseData);
        }, error => {
            this.error.next(error.message);
        });

    }

    fetchPosts() {
     return this.http
    .get<{ [key: string]: Post }>('https://ng-complete-guide-c111d.firebaseio.com/posts.json')
    .pipe(
      map(responseData => {
      const postsArray: Post[] = [];
      for(const key in responseData) {
        if(responseData.hasOwnProperty(key)) {
          postsArray.push({...responseData[key], id: key});
        }
       }
       return postsArray;
    }),
    //this doesn't do anything right now, we are just learning that we can use catchError as another way to handle errors
    catchError(errorRes => {
        //send error to your own method to track errors
        return throwError(errorRes)
    })
    );
   
    }

    deletePosts() {
            return this.http.delete('https://ng-complete-guide-c111d.firebaseio.com/posts.json')
             
        }
    }
