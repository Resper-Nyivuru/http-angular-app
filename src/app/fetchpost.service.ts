import { Injectable } from "@angular/core";
import { PostsService } from "./posts.service";
import { Post } from "./post.model";

@Injectable({
    providedIn: 'root'
})
export class FetchPost{
    loadedPosts: Post[] = [];
    isFetching = false;
    
    constructor(private postService: PostsService){

    }
    onFetchPostData(){
        this.isFetching = true;
        this.postService.fetchPosts().subscribe(posts => {
        this.isFetching = false;
        this.loadedPosts = posts;
    });
    }

}