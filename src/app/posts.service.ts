import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, ɵbypassSanitizationTrustResourceUrl } from "@angular/core";
import { Post } from "./post.model";
import { catchError, map, tap } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PostsService{
    error = new Subject<string>();
    
    constructor(private http: HttpClient){}

    createAndStoreRequests(title: string, author: string, content: string){
        const postData: Post = {title: title, author: author, content: content}
        // Send Http request //folder named posts.json
        //this.http.post('https://ng-complete-guide-8d7b8-default-rtdb.firebaseio.com/posts.json',
        this.http.post<{name: string}>('https://ng-complete-guide-8d7b8-default-rtdb.firebaseio.com/posts.json',
        postData, 
        {
          observe: 'response'
        })
        .subscribe( //note requests are only sent when you subscribe to the response
        responseData => { 
        console.log(responseData)
        }, error => {
          this.error.next(error.message)
        });
    }
    fetchPosts(){
      //for mutiple params
      let searchParams = new HttpParams();
      searchParams = searchParams.append('print', 'pretty');
      searchParams = searchParams.append('custom', 'key');

        return this.http.get<{[key: string]: Post}>('https://ng-complete-guide-8d7b8-default-rtdb.firebaseio.com/posts.json',
        { 
          //used for functions like authentication
          headers: new HttpHeaders({'custom-header': 'Hello there'}),
          //params: new HttpParams().set('print', 'pretty') //this changes the format for which firebase returns it's data
          params: searchParams,
          responseType: 'json'
        })
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
          }, catchError(errorResponse => {
            //this can be sent to an analystics server or logged to a file for reference
              return throwError(errorResponse);
          })
        ));
    }
    deletePosts(){
        return this.http.delete('https://ng-complete-guide-8d7b8-default-rtdb.firebaseio.com/posts.json',
        {
          observe: 'events',
          responseType: 'text'
        }).pipe(
          tap(event => {
            console.log(event);
            if(event.type === HttpEventType.Response){
              console.log(event.body);
            }
          }
        ));
    }
}