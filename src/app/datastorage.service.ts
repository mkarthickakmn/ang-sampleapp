import{Injectable,EventEmitter,OnInit} from '@angular/core';
import{BehaviorSubject,Subject} from 'rxjs';
import{HttpClient}from '@angular/common/http';
import{map,tap} from 'rxjs/operators';
import{AuthService}from './login/auth.service';
@Injectable({providedIn:'root'})
export class DataStorageService  {
constructor(private http:HttpClient,private auth:AuthService){}

 

	updateProfile(updated_values,mail)
	{
		return this.http
	  	.post<any>(
	    '/updateUser',
	    {
	      updated_values:updated_values,
	      mail:mail
	    }
	  )
			
	}

	createPost(user:any,post:any)
	{
		return this.http
	  	.post<any>(
	    '/createPost',
	    {
    	  mail:user.mail,
	      post:post
	    }
	  )
	}

	fetchPosts(mail:string)
	{
		return this.http
	  	.post<any>(
	    '/fetchPosts',
	    {
    	  mail:mail
	    }
	  )
	}

	getFriends(mail:string)
	{
		return this.http
	  	.post<any>(
	    '/getFriends',
	    {
	    	mail:mail
	    }
	  )
	}

	searchFriends(user,friend)
	{
		return this.http
	  	.post<any>(
	    '/setFriend',
	    {
	    	user:user,
	    	friend:friend
	    }
	  )

	}

	viewFriend(user:string,friend:string)
	{
		console.log(user+""+friend)
		return this.http
	  	.post<any>(
	    '/viewFriend',
	    {
	    	friend:friend,
	    	user:user
	    }
	  )		
	}


	viewposts(mail:string,user:string)
	{
		console.log(mail);
		return this.http
	  	.post<any>(
	    '/viewPosts',
	    {
	    	mail:mail,
	    	user:user
	    }
	  )		
	}

	likePost(id:number,post_mail:string,mail:string,like:number)
	{
		return this.http
	  	.post<any>(
	    '/likePost',
	    {
	    	post_id:id,
	    	post_mail:post_mail,
	    	mail:mail,
	    	like:like
	    }
	  )
	}

	unlikePost(id:number,post_mail:string,mail:string,like:number)
	{
		return this.http
	  	.post<any>(
	    '/unlikePost',
	    {
	    	post_id:id,
	    	post_mail:post_mail,
	    	mail:mail,
	    	like:like
	    }
	  )
	}

	sharePost(post:any,mail:string,user:string,id:string)
	{
		console.log(id);
		return this.http
	  	.post<any>(
	    '/sharePost',
	    {
	    	post:post,
	    	mail:mail,
	    	user:user,
	    	id:id
	    }
	  )
	}



	sendFriendRequests(from:string,to:string)
	{
		return this.http
	  	.post<any>(
	    '/sendFriendRequests',
	    {
	    	from:from,
	    	to:to
	    }
	  )
	}

	fetchFriendRequests(mail:string)
	{
		return this.http
	  	.post<any>(
	    '/fetchFriendRequests',
	    {
	    	mail:mail
	    }
	  )
	}


	acceptFriendRequests(friend:string,user:string,id:string)
	{
		return this.http
	  	.post<any>(
	    '/acceptFriendRequest',
	    {
	    	friend:friend,
	    	user:user,
	    	id:id
	    }
	  )		
	}

	delFriendRequests(from:string,to:string)
	{
		return this.http
	  	.post<any>(
	    '/delFriendRequest',
	    {
	    	from:from,
	    	to:to
	    }
	  )		
	}

	countFriendRequests(mail:string)
	{
		return this.http
	  	.post<any>(
	    '/countFriendRequest',
	    {
	    	mail:mail
	    }
	  )	
	}

	removeFriend(user:string,friend:string)
	{
		return this.http
	  	.post<any>(
	    '/removeFriend',
	    {
	    	user:user,
	    	friend:friend
	    }
	  )		
	}

	fetchFriends(mail:string)
	{
		return this.http
	  	.post<any>(
	    '/fetchFriends',
	    {
	    	user:mail
	    }
	  )	
	}

	fetchFriendCount(mail:string)
	{
		return this.http
	  	.post<any>(
	    '/countFriends',
	    {
	    	user:mail
	    }
	  )	
	}

	setProfilePrivacy(mail:string,privacy:string)
	{
		return this.http
	  	.post<any>(
	    '/setProfilePrivacy',
	    {
	    	mail:mail,
	    	type:'profile',
	    	privacy:privacy

	    }
	  )		
	}

	getProfilePrivacy(mail:string)
	{
		return this.http
	  	.post<any>(
	    '/getProfilePrivacy',
	    {
	    	mail:mail,
	    	type:'profile'

	    }
	  )
	}

	setPostPrivacy(mail:string,privacy:string)
	{
		return this.http
	  	.post<any>(
	    '/setPostPrivacy',
	    {
	    	mail:mail,
	    	privacy:privacy
	    }
	  )
	}

	getPostPrivacy(mail:string)
	{
		return this.http
	  	.post<any>(
	    '/getPostPrivacy',
	    {
	    	mail:mail
	    }
	  )
	}

	fetchChats(mail:string)
	{
		return this.http
	  	.post<any>(
	    '/fetchChats',
	    {
	    	mail:mail
	    }
	  )	
	}

	countChat(mail:string)
	{
		return this.http
	  	.post<any>(
	    '/countChat',
	    {
	    	mail:mail
	    }
	  )	
	}

	selfPosts(mail:string)
	{
		console.log("hi");
		return this.http
	  	.post<any>(
	    '/selfPosts',
	    {
	    	mail:mail
	    }
	  )	
	}

	delPost(id:number)
	{
		return this.http
	  	.post<any>(
	    '/delPost',
	    {
	    	id:id
	    }
	  )	
	}

	getNotifications(mail:string)
	{
		return this.http
	  	.post<any>(
	    '/notifications',
	    {
	    	mail:mail
	    }
	  )	
	}

	changeVisibility(mail:string)
	{
		return this.http
	  	.post<any>(
	    'http://localhost:3000/changeVisibility',
	    {
	    	mail:mail
	    }
	  )	
	}

	getPost(id:string,mail:string)
	{
		return this.http
	  	.post<any>(
	    '/getPost',
	    {
	    	id:id,
	    	mail:mail
	    }
	  )	
	}

	countNotify(mail:string)
	{
		return this.http
	  	.post<any>(
	    '/countNotify',
	    {
	    	mail:mail
	    }
	  )	
	}

}