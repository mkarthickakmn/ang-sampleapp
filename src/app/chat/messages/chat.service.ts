import * as io from 'socket.io-client';
import{Injectable} from '@angular/core';
import{Observable,Subject} from 'rxjs';
import{tap,take} from 'rxjs/operators';
@Injectable({providedIn:'root'})
export class ChatService {
    private url = 'http://localhost:3000';
    private socket;
     getFriends=new Subject<string>();
     getChat=new Subject<string>();
    constructor() {

        this.socket = io(this.url);
    }

    public newUser(email:string)
    {
        this.socket.emit("new_user",email);
    }

    public sendMessage(msg:any)
    {
        this.socket.emit("send_msg",msg);

    }

    public receiveMsg()
    {
        return Observable.create(observe=>{
            this.socket.on('send-message',message=>{
            observe.next(message);
            })
        })
    }


    public getMessages(email:any)
    {
        this.socket.emit('get_msg',email);
    	return Observable.create(observe=>{
    		this.socket.on('chat-message',message=>{
			observe.next(message);
    		})
    	})
    }

    public getFriendList()
    {
         return Observable.create(observe=>{
            this.socket.on('friendsjoined',friends=>{
            observe.next(friends);
            })
        })
    }

    public updateMsg(msg:any)
    {
         this.socket.emit('update_msg',msg);
         return Observable.create(observe=>{
            this.socket.on('messageSeen',msgs=>{
            observe.next(msgs);
            })
        })
    }

    public getDisconnected()
    {
        return Observable.create(observe=>{
            this.socket.on('frienddisconnected',friends=>{
            observe.next(friends);
            })
        })
    }

    public disconnected(email:string)
    {
        this.socket.emit("disconnected",email);
    }




    public sendFriendReq(mail:string)
    {
          this.socket.emit("sendFriendReq",mail);   
    }


    public getFriendReq()
    {
           return Observable.create(observe=>{
            this.socket.on('getFriendReq',friends=>{
            observe.next(friends);
            })
        })  
    }

    public likePost(mail:string)
    {
         this.socket.emit("likePost",mail);   
    }

     public getLikePosts()
    {
           return Observable.create(observe=>{
            this.socket.on('getlikePost',likes=>{
            observe.next(likes);
            console.log(likes);
            })
        })  
    }

       
}
