import{Injectable,EventEmitter,OnInit} from '@angular/core';
import{BehaviorSubject,Subject} from 'rxjs';
import{HttpClient}from '@angular/common/http';
import{map,tap} from 'rxjs/operators';
@Injectable({providedIn:'root'})
export class HomeService
{
	updateHomePage=new Subject<any>();
	updateImage=new Subject<string>();
}