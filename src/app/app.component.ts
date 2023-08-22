import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { FetchPost } from './fetchpost.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error =  null;
  private errorSubscription: Subscription;

  constructor(private http: HttpClient, private postService: PostsService) {}

  ngOnInit() {

    this.errorSubscription = this.postService.error.subscribe(
      errorMessage => {
        this.error = errorMessage;
      }
    );

    this.isFetching = true;
        this.postService.fetchPosts().subscribe(posts => {
        this.isFetching = false;
        this.loadedPosts = posts;
    }, error => {
      this.isFetching = false;
      this.error = error.message;
      console.log(this.error);
  });
  }

  onCreatePost(postData: Post) {
    this.postService.createAndStoreRequests(postData.title, postData.content);
  }
  onFetchPosts() {
    // Send Http request //call the fetch posts private property here
    this.isFetching = true;
        this.postService.fetchPosts().subscribe(posts => {
        this.isFetching = false;
        this.loadedPosts = posts;
    }, error => {
        this.error = error.message;
    });
  }
  onClearPosts() {
    // delete the data
    this.postService.deletePosts().subscribe(()=>{
      this.loadedPosts = [];
    });
  }
  onHandleError(){
    this.error = null;
  }
  ngOnDestroy(){
    this.errorSubscription.unsubscribe();
  }
}
