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
	    'http://localhost:3000/updateUser',
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
	    'http://localhost:3000/createPost',
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
	    'http://localhost:3000/fetchPosts',
	    {
    	  mail:mail
	    }
	  )
	}

	getFriends(mail:string)
	{
		return this.http
	  	.post<any>(
	    'http://localhost:3000/getFriends',
	    {
	    	mail:mail
	    }
	  )
	}

	searchFriends(user,friend)
	{
		return this.http
	  	.post<any>(
	    'http://localhost:3000/setFriend',
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
	    'http://localhost:3000/viewFriend',
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
	    'http://localhost:3000/viewPosts',
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
	    'http://localhost:3000/likePost',
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
	    'http://localhost:3000/unlikePost',
	    {
	    	post_id:id,
	    	post_mail:post_mail,
	    	mail:mail,
	    	like:like
	    }
	  )
	}

	sharePost(post:any,mail:string,user:string)
	{
		return this.http
	  	.post<any>(
	    'http://localhost:3000/sharePost',
	    {
	    	post:post,
	    	mail:mail,
	    	user:user
	    }
	  )
	}



	sendFriendRequests(from:string,to:string)
	{
		return this.http
	  	.post<any>(
	    'http://localhost:3000/sendFriendRequests',
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
	    'http://localhost:3000/fetchFriendRequests',
	    {
	    	mail:mail
	    }
	  )
	}


	acceptFriendRequests(friend:string,user:string,id:string)
	{
		return this.http
	  	.post<any>(
	    'http://localhost:3000/acceptFriendRequest',
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
	    'http://localhost:3000/delFriendRequest',
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
	    'http://localhost:3000/countFriendRequest',
	    {
	    	mail:mail
	    }
	  )	
	}

	removeFriend(user:string,friend:string)
	{
		return this.http
	  	.post<any>(
	    'http://localhost:3000/removeFriend',
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
	    'http://localhost:3000/fetchFriends',
	    {
	    	user:mail
	    }
	  )	
	}

	fetchFriendCount(mail:string)
	{
		return this.http
	  	.post<any>(
	    'http://localhost:3000/countFriends',
	    {
	    	user:mail
	    }
	  )	
	}

	setProfilePrivacy(mail:string,privacy:string)
	{
		return this.http
	  	.post<any>(
	    'http://localhost:3000/setProfilePrivacy',
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
	    'http://localhost:3000/getProfilePrivacy',
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
	    'http://localhost:3000/setPostPrivacy',
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
	    'http://localhost:3000/getPostPrivacy',
	    {
	    	mail:mail
	    }
	  )
	}

	fetchChats(mail:string)
	{
		return this.http
	  	.post<any>(
	    'http://localhost:3000/fetchChats',
	    {
	    	mail:mail
	    }
	  )	
	}

	countChat(mail:string)
	{
		return this.http
	  	.post<any>(
	    'http://localhost:3000/countChat',
	    {
	    	mail:mail
	    }
	  )	
	}

	selfPosts(mail:string)
	{
		return this.http
	  	.post<any>(
	    'http://localhost:3000/selfPosts',
	    {
	    	mail:mail
	    }
	  )	
	}

	delPost(id:number)
	{
		return this.http
	  	.post<any>(
	    'http://localhost:3000/delPost',
	    {
	    	id:id
	    }
	  )	
	}

	getNotifications(mail:string)
	{
		return this.http
	  	.post<any>(
	    'http://localhost:3000/notifications',
	    {
	    	mail:mail
	    }
	  )	
	}

	getPost(id:string,mail:string)
	{
		return this.http
	  	.post<any>(
	    'http://localhost:3000/getPost',
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
	    'http://localhost:3000/countNotify',
	    {
	    	mail:mail
	    }
	  )	
	}

}