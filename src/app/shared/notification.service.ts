import{Injectable} from '@angular/core';
import{Subject} from 'rxjs';
@Injectable({providedIn:'root'})
export class Notification
{
	getChatCount=new Subject<number>();
	getFriendCount=new Subject<number>();
	getNotifyCount=new Subject<number>();
	getPage=new Subject<string>();
}