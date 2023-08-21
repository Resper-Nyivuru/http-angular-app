import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    // Send Http request //folder named posts.json
    //this.http.post('https://ng-complete-guide-8d7b8-default-rtdb.firebaseio.com/posts.json',
    this.http.post<{name: string}>('https://ng-complete-guide-8d7b8-default-rtdb.firebaseio.com/posts.json',
    postData).subscribe( //note requests are only sent when you subscribe to the response
      responseData => { 
      console.log(responseData)
    });

  }
  onFetchPosts() {
    // Send Http request //call the fetch posts private property here
    this.fetchPosts();
  }
  onClearPosts() {
    // Send Http request
  }
  //private property
  private fetchPosts(){
    this.http.get<{[key: string]: Post}>('https://ng-complete-guide-8d7b8-default-rtdb.firebaseio.com/posts.json')
    .pipe(map((responseData) => 
      {
        const postsArray: Post[] = [];
        //responseData: {[key: string]: Post}
        for (const key in responseData)
        {
          if(responseData.hasOwnProperty(key))
          {
            postsArray.push({ ...responseData[key], id:key}) //spread operator ...
          }
        }
        return postsArray;
      }
    ))
    .subscribe(
      posts => {
        this.loadedPosts = posts;
      }
    );
  }
}
