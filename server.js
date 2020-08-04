const express = require('express');
const path = require('path');
var fs=require('fs');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// Serve static files....
app.use(express.static(__dirname + '/dist/sample01'));

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/sample01/index.html'));
});

var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var dbo;
var url = process.env.MONGODB_URL;
MongoClient.connect(url ,{ useUnifiedTopology: true }, function(err, db) {
  if (err) throw err;
  dbo= db.db('chatter_box');
  console.log("Database connected!");
   
});
// default Heroku PORT
var server=app.listen((process.env.PORT),()=>{
	console.log("connected");
});
var users=[];
var notifications=[];
var notify="";


app.post('/insertUser',(req,res)=>{
	var user=req.body.user;
	user.image='';
	dbo.collection("users").findOne({mail:req.body.mail},function(err,result)
	{
		if(err) throw err;
		if(!result)
			dbo.collection("users").insertOne({...user}, function(err, user) 
			{
			    if (err) throw err;
			    console.log("user inserted successfully");
			    res.send(user);
			})
		else
			res.send({});

	})
	
    
  });


app.post('/getUser',function(req,res)
{
	console.log(req.body.credentials);
	dbo.collection("users").findOne(req.body.credentials, function(err, result) 
	{
	    if (err) throw err;
	    if(result)
	    if(result.image=="")
	    {
	    	result.gender=='Male'?result.image='male.jpg':result.image='female.jpg'	
		    var filePath = path.join(__dirname, '/profile/' +result.image);															
			var data = fs.readFileSync(filePath);
			result.image='data:image/png;base64,' + data.toString('base64');
	    }

	    res.send(result);
	})
})

app.post('/updateUser',function(req,res)
{
var myquery = {mail:req.body.mail};
  var newvalues = { $set: req.body.updated_values};
  dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
    if (err) throw err;
    console.log("1 document updated");
    res.send(result);
  });
})


app.post('/updatePwd',function(req,res)
{
var myquery = {mail:req.body.mail};
  var newvalues = { $set: {pwd:req.body.pwd}};
  dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
    if (err) throw err;
    console.log("1 document updated");
    res.send(result);
  });
})

app.post('/createPost',function(req,res)
{
	if(req.body.post.type=="privacy")
	{
		dbo.collection("users").findOne({mail:req.body.mail},function(err,privacy)
		{
			if(privacy.post_privacy)
				dbo.collection("posts").insertOne
			  	({mail:req.body.mail,
			  	post:{caption:req.body.post.caption,desc :req.body.post.desc,img:req.body.post.img},
			  	type:req.body.post.type,privacy:privacy.post_privacy,time:new Date().getTime()}, function(err, result) 
				{
				    if (err) throw err;
				    console.log("post inserted with privacy successfully");
				    post_notify("privacy");
				    res.send(result);
				});
			else
			{
				dbo.collection("posts").insertOne
			  	({mail:req.body.mail,
			  	post:{caption:req.body.post.caption,desc :req.body.post.desc,img:req.body.post.img},
			  	type:req.body.post.type,privacy:"Show to everyone",time:new Date().getTime()}, function(err, result) 
				{
				    if (err) throw err;
				    console.log("post inserted with privacy successfully");
				    post_notify("privacy");
				    res.send(result);
				});
			}
		});	
	}
	else
	{
		  dbo.collection("posts").insertOne
		  ({mail:req.body.mail,
		  	post:{caption:req.body.post.caption,desc :req.body.post.desc,img:req.body.post.img},
		  	type:req.body.post.type,time:new Date().getTime()}, function(err, result) 
			{
			    if (err) throw err;
			    console.log("post inserted successfully");
			     post_notify("public");
			    res.send(result);
			});
	}

	function post_notify(type)
	{
		dbo.collection("posts").findOne({mail:req.body.mail,
		  	post:{caption:req.body.post.caption,desc :req.body.post.desc,img:req.body.post.img},
		  	type:req.body.post.type},function(err,post){
		  		if(post)
		  		{
		  			dbo.collection("notifications").
					insertOne({post_id:post._id,post_mail:req.body.mail,user:req.body.mail,type:type,visibility:"unseen",time:new Date().getTime()},function(err,notify){
						console.log("post notifications inserted");
					})
				}
		})

	}
	
})


app.post('/fetchPosts',function(req,res)
{
	 
  	var shared_posts=[];
  	var p_id=[];
  	dbo.collection('friends').find({user:req.body.mail}).toArray(function(err,friends)
  	{
  		if(err) throw err;
  		if(friends.length>0)
	  		dbo.collection('posts').find({}).sort({time:-1}).toArray(function(err,posts)
		  	{
		  		if(err) throw err;
		  		if(posts.length>0)
		  		{
		  			function fetch_post(i)
		  			{
		  				if(i<posts.length)
		  				{
							
	  						function fetch_friends(j)
	  						{
	  							if(j<friends.length)
	  							{

	  								function repeat()
	  								{
	  									if(i<posts.length&&posts[i].mail==req.body.mail)
	  									{

	  										p_id.push(posts[i]._id);	  										
  											shared_posts.push(posts[i]);
	  										i++;
	  										repeat(); 	
	  									}

	  								}

	  								repeat();
	  									
	  									if(i<posts.length&&posts[i].type=="public")
	  									{
	  										p_id.push(posts[i]._id);
		  									shared_posts.push(posts[i]);
		  									i++;
		  									// j++;
	  										fetch_friends(j);

	  									}
  										else if(i<posts.length&&posts[i].privacy=="Show to everyone")
	  									
	  									{
	  										p_id.push(posts[i]._id);
		  									shared_posts.push(posts[i]);
		  									i++;
		  									fetch_friends(j);
	  									}
	  									 else if(i<posts.length&&posts[i].type&&(posts[i].type=="privacy"&&posts[i].privacy=="Hide from everyone"))
	  									{
	  										p_id.push(posts[i]._id);
	  										i++;
	  										fetch_friends(j);
	  									}

	  									else if(i<posts.length&&posts[i].mail==friends[j].friend&&posts[i].privacy=='Show to Friends only')
	  									{
		  									p_id.push(posts[i]._id);
	  										shared_posts.push(posts[i]);
	  										
	  									}
	  									else
	  									{
	  										j++;
	  										fetch_friends(j);
	  									}
	  				
	  								
	  							}
	  				
	  						}
	  						fetch_friends(0);
		  					
		  					i++;
		  					fetch_post(i);
		  				}
		  				else
		  				{
		  					
		  					if(shared_posts.length>0)
		  					{
		  						function fetch_shared_posts(k)
			  					{
			  						if(k<shared_posts.length)
			  						{

	  										if(shared_posts[k].sharedFrom!=undefined)
											{
												dbo.collection("users").find({mail:shared_posts[k].sharedFrom}).project({name:1}).toArray(function(err, share) 
												{
												    if (err) throw err;
													
												    if(shared_posts[k].sharedFrom&&shared_posts[k].sharedFrom==req.body.mail)
												    	{

												    		shared_posts[k].sharer="Your";
												    	}
												    else	
												    	shared_posts[k].sharer=share[0].name;
													
												 }) 	
										
											}
											
										
			  							dbo.collection("users").findOne({mail:shared_posts[k].mail}, function(err, users) 
										{
										    if (err) throw err;
										    if(shared_posts[k].sharedFrom!=undefined&&users.mail==req.body.mail)
										    {
										    	shared_posts[k].name="You";
										    }
											else if(users.mail==req.body.mail)
											{
												shared_posts[k].name="You";
											}
										    else	
										    	shared_posts[k].name=users.name;
								
											function formatAMPM(time) {
											var date=new Date(time);
											  var hours = date.getHours();
											  var minutes = date.getMinutes();
											  var ampm = hours >= 12 ? 'pm' : 'am';
											  hours = hours % 12;
											  hours = hours ? hours : 12; // the hour '0' should be '12'
											  minutes = minutes < 10 ? '0'+minutes : minutes;
											  var strTime = hours + ':' + minutes + ' ' + ampm;
											  shared_posts[k].post_time=strTime;
											}

											(formatAMPM(shared_posts[k].time));
											const monthNames = ["January", "February", "March", "April", "May", "June",
										        "July", "August", "September", "October", "November", "December"];
										    let dateObj = new Date(shared_posts[k].time);
										    let month = monthNames[dateObj.getMonth()];
										    let day = String(dateObj.getDate()).padStart(2, '0');
										    let year = dateObj.getFullYear();
										    let output = day  + ' '+ month  + ' ' + year;
											shared_posts[k].post_date=output;
											
											function user_privacy(users)
											{
												 if(users.image=="")
												
												    {
												    	users.gender=='Male'?users.image='male.jpg':users.image='female.jpg'	
													    var filePath = path.join(__dirname, '/profile/' +users.image);															
														var data = fs.readFileSync(filePath);
														users.image='data:image/png;base64,' + data.toString('base64');
														shared_posts[k].image=users.image;	
														k++;
														fetch_shared_posts(k);
												    }
												    else
												    {
												    	shared_posts[k].image=users.image;
												    	k++;
														fetch_shared_posts(k);
												    }
											}

											function user_privacy2(users)
											{
												users.gender=='Male'?users.image='male.jpg':users.image='female.jpg'	
											    var filePath = path.join(__dirname, '/profile/' +users.image);															
												var data = fs.readFileSync(filePath);
												users.image='data:image/png;base64,' + data.toString('base64');
												shared_posts[k].image=users.image;	
												k++;
												fetch_shared_posts(k);
											}
											if(users.mail!=req.body.mail)
											{

												if(users.privacy&&users.privacy=="Hide from everyone")
												{
													user_privacy2(users);
												}
												else
												{
													user_privacy(users);
												}
											}
											else
											{
												user_privacy(users);
											}
										})										
										   							   

										// })
			  						}
			  						else
			  						{
			  							var c=0;
			  							function add(x)
			  							{
			  								if(x<shared_posts.length)
			  								{
			  										dbo.collection("likes").find({like:1}).toArray (function(err, likes) 
													{
													    if (err) throw err;

													    function setLike(l)
													    {
													    	if(l<likes.length)
													    	{
													    		if(shared_posts[x]._id==likes[l].post_id)
													    		{
													    			c++;
													    		}
													    		if(likes[l].post_id==shared_posts[x]._id&&likes[l].mail==req.body.mail)
													    		{
													    			
													    	
													    			shared_posts[x].like=likes[l].like;
													    		}


													    		l++;
													    		setLike(l);
													    	}
													    	else
													    	{
													    		shared_posts[x].count=c;
													    		c=0;
													    		x++;
			  													add(x);
													    	}
													    }
													    setLike(0)

													})
			  									
			  								}
			  								else
			  								{
			  									res.send(shared_posts);
			  								}
			  							}
			  							add(0);			  														
			  					
			  						}
			  					}
			  					fetch_shared_posts(0)
			  					}
		  					
		  				}
		  			}
		  			fetch_post(0);
		  		}
		  		else
		  		{
		  			res.send([]);
		  		}
		  		
		  	})
			else
			{
				// if no friends

				dbo.collection('posts').find({$or:[{mail:req.body.mail},{sharedFrom:req.body.mail,privacy:"Show to everyone"},{type:"public"},{privacy:"Show to everyone"}]}).sort({time:-1}).toArray(function(err,posts)
			  	{
			  		if(err) throw err;
			  		if(posts.length>0)
			  		{
			  				function fetch_post(i)
			  				{
			  					if(i<posts.length)
			  					{

			  						if(posts[i].sharedFrom!=undefined)
									{
										dbo.collection("users").find({mail:posts[i].sharedFrom}).project({name:1,mail:1}).toArray(function(err, share) 
										{	
										    if (err) throw err;
						
									    	if(share[0].mail==req.body.mail)
									    	{
									    		posts[i].sharer="Your";
									    	}
										    else 	
										    	posts[i].sharer=share[0].name;
										
										 }) 	
										
									}
					
										dbo.collection('users').findOne({mail:posts[i].mail},function(err,user)
									  	{
									  		if(err) throw err;
									  		if(user.mail==req.body.mail)
									  		{
									  			posts[i].name="You";
									  		}
									  		else if(user.mail!=req.body.mail)
									  			posts[i].name=user.name;
									  		posts[i].image=user.image;
									  		
								  			function formatAMPM(time) {
												var date=new Date(time);
												  var hours = date.getHours();
												  var minutes = date.getMinutes();
												  var ampm = hours >= 12 ? 'pm' : 'am';
												  hours = hours % 12;
												  hours = hours ? hours : 12; // the hour '0' should be '12'
												  minutes = minutes < 10 ? '0'+minutes : minutes;
												  var strTime = hours + ':' + minutes + ' ' + ampm;
												  // return strTime;
												  posts[i].post_time=strTime;
												}

												(formatAMPM(posts[i].time));
												const monthNames = ["January", "February", "March", "April", "May", "June",
											        "July", "August", "September", "October", "November", "December"];
											    let dateObj = new Date(posts[i].time);
											    let month = monthNames[dateObj.getMonth()];
											    let day = String(dateObj.getDate()).padStart(2, '0');
											    let year = dateObj.getFullYear();
											    let output = day  + ' '+ month  + ' ' + year;
												posts[i].post_date=output;
												
												// dbo.collection("privacy").findOne({$and:[{mail:user.mail},{mail:{$ne:req.body.mail}}]},function(err,privacy){
												// if(err) throw err;
												// 	console.log(privacy)
												if(user.mail!=req.body.mail)
												{
													if(user.privacy&&user.privacy=="Hide from everyone")
													{
														user.gender=='Male'?user.image='male.jpg':user.image='female.jpg'	
													    var filePath = path.join(__dirname, '/profile/' +user.image);															
														var data = fs.readFileSync(filePath);
														user.image='data:image/png;base64,' + data.toString('base64');
														posts[i].image=user.image;	
														i++;
														fetch_post(i);
													}
													else if(user.privacy&&user.privacy=="Show to Friends only")
													{
															dbo.collection("friends").findOne({$and:[{"user":req.body.mail},{"friend":user.mail}]},function(err, checkfriend) 
											 				{
											 					if(!checkfriend)
											 					{
											 						user.gender=='Male'?user.image='male.jpg':user.image='female.jpg'	
																    var filePath = path.join(__dirname, '/profile/' +user.image);															
																	var data = fs.readFileSync(filePath);
																	user.image='data:image/png;base64,' + data.toString('base64');
																	posts[i].image=user.image;	
																	i++;
																	fetch_post(i);
											 					}
											 					else
											 					{
											 						if(user.image=="")
																    {
																    	user.gender=='Male'?user.image='male.jpg':user.image='female.jpg'	
																	    var filePath = path.join(__dirname, '/profile/' +user.image);															
																		var data = fs.readFileSync(filePath);
																		user.image='data:image/png;base64,' + data.toString('base64');
																		posts[i].image=user.image;	
																		
																		
																		i++;
																		fetch_post(i);
																    }
																    else
																    {
																    	posts[i].image=user.image;	
																    	i++;
																		fetch_post(i);
																    } 
											 					}
											 				})	
													}
										 			else
										 			{									
													    if(user.image=="")
													    {
													    	user.gender=='Male'?user.image='male.jpg':user.image='female.jpg'	
														    var filePath = path.join(__dirname, '/profile/' +user.image);															
															var data = fs.readFileSync(filePath);
															user.image='data:image/png;base64,' + data.toString('base64');
															posts[i].image=user.image;	
															
															
															i++;
															fetch_post(i);
													    }
													    else
													    {
													    	posts[i].image=user.image;	
													    	i++;
															fetch_post(i);
													    } 
												    } 
											    }
											    else
											    {
											    	 if(user.image=="")
													    {
													    	user.gender=='Male'?user.image='male.jpg':user.image='female.jpg'	
														    var filePath = path.join(__dirname, '/profile/' +user.image);															
															var data = fs.readFileSync(filePath);
															user.image='data:image/png;base64,' + data.toString('base64');
															posts[i].image=user.image;	
															
															
															i++;
															fetch_post(i);
													    }
													    else
													    {
													    	posts[i].image=user.image;	
													    	i++;
															fetch_post(i);
													    } 
											    }	
									   		 })	
									  	// })
			
			  					}
			  					else
			  					{
			  						var c=0;
			  							function add(x)
			  							{
			  								if(x<posts.length)
			  								{
			  										dbo.collection("likes").find({like:1}).toArray (function(err, likes) 
													{
													    if (err) throw err;

													    function setLike(l)
													    {
													    	if(l<likes.length)
													    	{
													    		// console.log(k);
													    		if(posts[x]._id==likes[l].post_id)
													    		{
													    			c++;
													    		}
													    		if(likes[l].post_id==posts[x]._id&&likes[l].mail==req.body.mail)
													    		{
													    			
													    	
													    			posts[x].like=likes[l].like;
													    		}


													    		l++;
													    		setLike(l);
													    	}
													    	else
													    	{
													    		posts[x].count=c;
													    		c=0;
													    		x++;
			  													add(x);
													    	}
													    }
													    setLike(0)

													})
			  									
			  								}
			  								else
			  								{
			  									res.send(posts);
			  								}
			  							}
			  							add(0);
			  					}
			  				}
			  				fetch_post(0);
			  			
			  		}
			  		else
			  		{
			  			res.send([]);
			  		}
			  	})
			}
  	})


})


app.post('/likePost',function(req,res)
{

 
  dbo.collection("likes").findOne({post_id:req.body.post_id,mail:req.body.mail,like:-1}, function(err, likes) 
	{
	    if (err) throw err;
	    console.log(likes);
	   	if(likes)
	   	{
	   		var myquery = {post_id:req.body.post_id,mail:req.body.mail};
	   		var myquery1 = {post_id:req.body.post_id,mail:req.body.mail};
		  	var newvalues = { $set: {like:1,time:new Date().getTime()}};
	  	  	var newvalues1 = { $set: {like:1,visibility:'unseen',time:new Date().getTime()}};
		  	dbo.collection("likes").updateOne(myquery, newvalues, function(err, result) {
		    if (err) throw err;
				dbo.collection("notifications").updateMany(myquery1, newvalues1, function(err, result) 
				{
				    if (err) throw err;
				    res.send(result);
				})
		  		
		  });	
	   	}
	   	else
	   	{
	   		 dbo.collection("likes").insertOne({...req.body,time:new Date().getTime()}, function(err, result) 
			{
			    if (err) throw err;
			   dbo.collection("notifications").insertOne({...req.body,user:req.body.mail,visibility:'unseen',time:new Date().getTime()}, function(err, result) 
				{
				    if (err) throw err;
				    if(req.body.mail!=req.body.post_mail)
				     {
				     	dbo.collection("notifications").insertOne({...req.body,user:req.body.post_mail,visibility:'unseen',time:new Date().getTime()}, function(err, result) 
    					{
    						res.send(result);
    					})	
				     }
				     else
				     {
				     	res.send(result);
				     }			    
				})
		   		
	  		})
	
	   	}
	    
	});
})


app.post('/unlikePost',function(req,res)
{
    var myquery = {post_id:req.body.post_id,mail:req.body.mail};
	var myquery1 = {post_id:req.body.post_id,mail:req.body.mail};
  	var newvalues = { $set: {like:-1,time:new Date().getTime()}};
  	var newvalues1 = { $set: {like:-1,visibility:'unseen',time:new Date().getTime()}};
  	dbo.collection("likes").updateOne(myquery, newvalues, function(err, result) {
    if (err) throw err;
    console.log("1 document updated");
    dbo.collection("notifications").updateMany(myquery1, newvalues1, function(err, result) 
	{
	    if (err) throw err;
	    res.send(result);
	})
  });
	   	
})


app.post('/sharePost',function(req,res)
{
	dbo.collection("users").findOne({mail:req.body.user},function(err, user) 
	{	
	    if (err) throw err;
	  dbo.collection("posts").
	  insertOne({mail:req.body.user,sharedFrom:req.body.mail,privacy:user.post_privacy,post:req.body.post,time:new Date().getTime()}, function(err, posts) 
		{
		    if (err) throw err;
		    notify=req.body.user+" shared "+req.body.mail+"'s post";
		    notifications.push(notify);
		  	res.send(posts);
		    
		});
	});
})


app.post('/getFriends',function(req,res)
{
	var final=[];
	var result={};
	 dbo.collection("users").find({"mail":{$ne:req.body.mail}}).toArray(function(err, friends) 
	 {
	    if (err) throw err;
	     if(friends.length>0)
	    {
	    	function fetch_friend(i)
	    	{
	    		if(i<friends.length)
	    		{

	    				result={};
	    	// 		dbo.collection("privacy").findOne({"mail":friends[i].mail},function(err, privacy) 
					 // {

					 //    if (err) throw err;
	
					    if(friends[i].privacy)
					    {
						    if(friends[i].privacy=="Show to everyone")
						    {
						    	result.name=friends[i].name;
						    	result.mail=friends[i].mail;
						    	 if(friends[i].image=="")
								    {
								    	friends[i].gender=='Male'?friends[i].image='male.jpg':friends[i].image='female.jpg'	
									    var filePath = path.join(__dirname, '/profile/' +friends[i].image);															
										var data = fs.readFileSync(filePath);
										friends[i].image='data:image/png;base64,' + data.toString('base64');
										result.image=friends[i].image;	
										final.push(result);	
							    		i++;
					    				fetch_friend(i);
								    }
								    else
								    {
								    	result.image=friends[i].image;	
								    	final.push(result);	
							    		i++;
					    				fetch_friend(i);
								 
								    } 
						    	
						    }
						    else if(friends[i].privacy=="Hide from everyone")
						    {

						    	result.name=friends[i].name;
						    	result.mail=friends[i].mail;
						    	result.gender=='Male'?result.image='male.jpg':result.image='female.jpg'	
							    var filePath = path.join(__dirname, '/profile/' +result.image);															
								var data = fs.readFileSync(filePath);
								result.image='data:image/png;base64,' + data.toString('base64');
								final.push(result);	
								i++;
			    				fetch_friend(i);
						    }
						  	 else if(friends[i].privacy=="Show to Friends only")
						    {

						    	dbo.collection("friends").findOne({$and:[{"user":req.body.mail},{"friend":friends[i].mail}]},function(err, checkfriend) 
				 				{
				 					if(err) throw err;
				 					if(checkfriend)
				 					{
				 						result.name=friends[i].name;
								    	result.mail=friends[i].mail;
								    	result.gender=friends[i].gender;
								    	if(friends[i].image=="")
									    {
									    	friends[i].gender=='Male'?friends[i].image='male.jpg':friends[i].image='female.jpg'	
										    var filePath = path.join(__dirname, '/profile/' +friends[i].image);															
											var data = fs.readFileSync(filePath);
											friends[i].image='data:image/png;base64,' + data.toString('base64');
											result.image=friends[i].image;	
											final.push(result);	
								    		i++;
						    				fetch_friend(i);
									    }
									    else
									    {
									    	result.image=friends[i].image;	
									    	final.push(result);	
								    		i++;
						    				fetch_friend(i);
									 
									    } 

				 					}
				 					else
				 					{
				 						result.name=friends[i].name;
								    	result.mail=friends[i].mail;
								    	result.gender=friends[i].gender;
								    	result.gender=='Male'?result.image='male.jpg':result.image='female.jpg'	
									    var filePath = path.join(__dirname, '/profile/' +result.image);															
										var data = fs.readFileSync(filePath);
										result.image='data:image/png;base64,' + data.toString('base64');
										final.push(result);	
										i++;
		    							fetch_friend(i);
				 					}
				 				})
										
						    }
						

							
						}
						else
						{
							result.name=friends[i].name;
					    	result.mail=friends[i].mail;
					    	if(friends[i].image=="")
							    {
							    	friends[i].gender=='Male'?friends[i].image='male.jpg':friends[i].image='female.jpg'	
								    var filePath = path.join(__dirname, '/profile/' +friends[i].image);															
									var data = fs.readFileSync(filePath);
									friends[i].image='data:image/png;base64,' + data.toString('base64');
									result.image=friends[i].image;	
									final.push(result);	
						    		i++;
				    				fetch_friend(i);
							    }
							    else
							    {
							    	result.image=friends[i].image;	
							    	final.push(result);	
						    		i++;
				    				fetch_friend(i);
							 
							    } 
						}
						   
					// })
						
	    		}
	    		else
	    		{
	    			// console.log(final);
	    			res.send(final);
	    		}
	    	}
	    	fetch_friend(0);
	    	 
	   	
	   }
	   	
	 })
})


app.post('/viewFriend',function(req,res)
{
	var result={};
	 dbo.collection("users").find({"mail":req.body.friend}).toArray(function(err, friends) 
	 {
	    if (err) throw err;
	    // res.send(friends);
	    if(friends.length>0)
	    {
	   //  	 dbo.collection("privacy").findOne({"mail":req.body.friend},function(err, privacy) 
			 // {

			 //    if (err) throw err;
			 //    console.log(privacy);
			    if(friends[0].privacy)
			    {
			    	if(users[friends[0].mail])
					    {
					    	friends[0].connection="online";
					    }
					    else
					    {
					    	friends[0].connection="offline";
					    }
				    if(friends[0].privacy=="Show to everyone")
				    {
				    	result.name=friends[0].name;
				    	result.mail=friends[0].mail;
				    	result.gender=friends[0].gender;
			    		if(friends[0].image=="")
						    {
						    	friends[0].gender=='Male'?friends[0].image='male.jpg':friends[0].image='female.jpg'	
							    var filePath = path.join(__dirname, '/profile/' +friends[0].image);															
								var data = fs.readFileSync(filePath);
								friends[0].image='data:image/png;base64,' + data.toString('base64');
								result.image=friends[0].image;	
							
						    }
						    else
						    {
						    	result.image=friends[0].image;	
 
						    }
				    	result.dob=friends[0].dob;
				    	result.mobile=friends[0].mobile;
				    	result.street=friends[0].street;
				    	result.city=friends[0].city;
				    	result.state=friends[0].state;
				    }
				    else if(friends[0].privacy=="Hide from everyone")
				    {
				    	console.log('hide');
				    	result.name=friends[0].name;
				    	result.mail=friends[0].mail;
				    	result.gender=friends[0].gender;
				    	result.gender=='Male'?result.image='male.jpg':result.image='female.jpg'	
					    var filePath = path.join(__dirname, '/profile/' +result.image);															
						var data = fs.readFileSync(filePath);
						result.image='data:image/png;base64,' + data.toString('base64');
				    }
				    else if(friends[0].privacy=="Show to Friends only")
				    {
				    	dbo.collection("friends").findOne({$and:[{"user":req.body.user},{"friend":friends[0].mail}]},function(err, checkfriend) 
		 				{
		 					if(err) throw err;
		 					if(checkfriend)
		 					{

		 						result.name=friends[0].name;
						    	result.mail=friends[0].mail;
						    	result.gender=friends[0].gender;
						    	if(friends[0].image=="")
							    {
							    	friends[0].gender=='Male'?friends[0].image='male.jpg':friends[0].image='female.jpg'	
								    var filePath = path.join(__dirname, '/profile/' +friends[0].image);															
									var data = fs.readFileSync(filePath);
									friends[0].image='data:image/png;base64,' + data.toString('base64');
									result.image=friends[0].image;	
								
							    }
							    else
							    {
							    	result.image=friends[0].image;	
	 
							    }
						    	result.dob=friends[0].dob;
						    	result.mobile=friends[0].mobile;
						    	result.street=friends[0].street;
						    	result.city=friends[0].city;
						    	result.state=friends[0].state;
		 					}
		 					else
		 					{
		 						result.name=friends[0].name;
						    	result.mail=friends[0].mail;
						    	result.gender=friends[0].gender;
						    	result.gender=='Male'?result.image='male.jpg':result.image='female.jpg'	
							    var filePath = path.join(__dirname, '/profile/' +result.image);															
								var data = fs.readFileSync(filePath);
								result.image='data:image/png;base64,' + data.toString('base64');
		 					}
		 				})
				    }
				}
				else
				{
					result.name=friends[0].name;
			    	result.mail=friends[0].mail;
			    	result.gender=friends[0].gender;
			    	if(friends[0].image=="")
				    {
				    	friends[0].gender=='Male'?friends[0].image='male.jpg':friends[0].image='female.jpg'	
					    var filePath = path.join(__dirname, '/profile/' +friends[0].image);															
						var data = fs.readFileSync(filePath);
						friends[0].image='data:image/png;base64,' + data.toString('base64');
						result.image=friends[0].image;	
					
				    }
				    else
				    {
				    	result.image=friends[0].image;	

				    }
			    	result.dob=friends[0].dob;
			    	result.mobile=friends[0].mobile;
			    	result.street=friends[0].street;
			    	result.city=friends[0].city;
			    	result.state=friends[0].state;
				}
					result.connection=friends[0].connection;	
				    dbo.collection("friendrequests").
				    find({ $or: [ {from:req.body.user,to:req.body.friend},{from:req.body.friend,to:req.body.user} ] } ).toArray(function(err,requests)
				   	{
				   		if(err) throw err;
				   		
				   		if(requests.length>0)
				   		{	if(requests[0].from==req.body.user)
				   				{
				   					friends[0].friendrequest="sent";
				   					result.friendrequest="sent";
				   				}
			   				else
			   					{
			   						friends[0].friendrequest="received";
			   						result.friendrequest="received";
			   					}
				   			res.send([result]);	
				   		}
				   		else
				   		{
				   			dbo.collection("friends").find({ $or: [ {user:req.body.user,friend:req.body.friend},{friend:req.body.user,user:req.body.friend} ] } ).
						   	toArray(function(err,friendlists)
						   	{
						   		if(err) throw err;
						   		if(friendlists.length>0)
						   		{
						   			friends[0].friendrequest="accepted";
						   			result.friendrequest="accepted";
						   			res.send([result]);
						   		}
						   		else
						   		{
						   			friends[0].friendrequest="";
						   			result.friendrequest="";
						   			res.send([result]);
						   		}
						   	})
				   				
				   		}	   		
				   	})
			// })
	   	
	   }
	   	else
	   		res.send([]);
  	});
})

app.post('/viewPosts',function(req,res)
{
	var final=[];
	var noPostReason;
	 dbo.collection("posts").find({$or:[{"mail":req.body.mail}]}).sort({time:-1}).toArray(function(err, posts) 
	 {
	    if (err) throw err;
	    if(posts.length>0)
	    {
	    	function fetch_post(i)
	    	{
	    		if(i<posts.length)
	    		{
	    			if(posts[i].sharedFrom!=undefined)
					{
						dbo.collection("users").find({mail:posts[i].sharedFrom}).project({name:1,mail:1}).toArray(function(err, share) 
												 
						{
						    if (err) throw err;
						    	if(share[0].mail==req.body.user)
						    	{
						    		posts[i].sharer="Your";
						    	}
						    	if(share[0].mail!=req.body.user)
						    		posts[i].sharer=share[0].name;
							
						 }) 	
					}
	    			function formatAMPM(time) {
					  var date=new Date(time);
					  var hours = date.getHours();
					  var minutes = date.getMinutes();
					  var ampm = hours >= 12 ? 'pm' : 'am';
					  hours = hours % 12;
					  hours = hours ? hours : 12; // the hour '0' should be '12'
					  minutes = minutes < 10 ? '0'+minutes : minutes;
					  var strTime = hours + ':' + minutes + ' ' + ampm;
					  // return strTime;
					  posts[i].post_time=strTime;
					}

					(formatAMPM(posts[i].time));
					const monthNames = ["January", "February", "March", "April", "May", "June",
				        "July", "August", "September", "October", "November", "December"];
				    let dateObj = new Date(posts[i].time);
				    let month = monthNames[dateObj.getMonth()];
				    let day = String(dateObj.getDate()).padStart(2, '0');
				    let year = dateObj.getFullYear();
				    let output = day  + ' '+ month  + ' ' + year;
					posts[i].post_date=output;	
	    			dbo.collection("users").findOne({"mail":posts[i].mail},function(err,user)
	    			{

	    				if(user.mail==req.body.user)
	    					posts[i].name="You";
    					if(user.mail!=req.body.user)	
	    					posts[i].name=user.name;

	    				function user_privacy(user)
	    				{
	    					if(user.image=="")
							    {
							    	user.gender=='Male'?user.image='male.jpg':user.image='female.jpg'	
								    var filePath = path.join(__dirname, '/profile/' +user.image);															
									var data = fs.readFileSync(filePath);
									user.image='data:image/png;base64,' + data.toString('base64');
									posts[i].image=user.image;	
									
									final.push(posts[i]);
									i++;
									fetch_post(i);
							    }
							    else
							    {
							    	posts[i].image=user.image;	
							    	final.push(posts[i]);
							    	i++;
									fetch_post(i);
							    }
	    				}

	    				function user_privacy2(user)
	    				{
	    					user.gender=='Male'?user.image='male.jpg':user.image='female.jpg'	
						    var filePath = path.join(__dirname, '/profile/' +user.image);															
							var data = fs.readFileSync(filePath);
							user.image='data:image/png;base64,' + data.toString('base64');
							posts[i].image=user.image;	
							
							final.push(posts[i]);
							i++;
							fetch_post(i);
	    				}
	    				if(user.type!='public')
					   		noPostReason=user.post_privacy;			
					    if((user.post_privacy&&user.post_privacy=="Show to everyone"))
					   {
				 			if(user.privacy&&user.privacy=="Show to Friends only")
	 						{								
							  
							  dbo.collection("friends").findOne({"user":req.body.user,"friend":req.body.mail},function(err, checkfriend) 
				 				{
				 					if(checkfriend)
				 					{
				 						user_privacy(user);
				 					}
				 					else
				 					{
				 						user_privacy2(user);
				 						
				 					}
				 				})
							}
							else if(user.privacy&&user.privacy=="Show to everyone")
							{
								user_privacy(user);
							}
							else
							{
								user_privacy2(user);
							}
					    }
						else if(user.post_privacy&&user.post_privacy=="Show to Friends only")
						{
							console.log(req.body.user+"/"+req.body.mail)
							dbo.collection("friends").findOne({"user":req.body.user,"friend":req.body.mail},function(err, checkfriend) 
			 				{
			 					if(checkfriend)
			 					{
			 						if(user.privacy&&user.privacy=="Show to Friends only"||user.privacy&&user.privacy=="Show to everyone")
			 						{
			 						 
									  user_privacy(user);
			 						}
			 						else
			 						{
		 								user_privacy2(user)
			 						}
			 						
			 					}
			 					else
			 					{
			 						noPostReason="not a Friend"
			 						i++;
									fetch_post(i);
			 					}
				 		
				 				})	
						}
					    else 
					    {
					    	i++;
							fetch_post(i);
					    } 	
	    			})
	    		}
	    		else
	    		{
	    			var c=0;
					function add(x)
					{
						if(x<final.length)
						{
								dbo.collection("likes").find({like:1}).toArray (function(err, likes) 
							{
							    if (err) throw err;

							    function setLike(l)
							    {
							    	if(l<likes.length)
							    	{
							    		// console.log(k);
							    		if(final[x]._id==likes[l].post_id)
							    		{
							    			c++;
							    		}
							    		if(likes[l].post_id==final[x]._id&&likes[l].mail==req.body.user)
							    		{
							    			
							    	
							    			final[x].like=likes[l].like;
							    		}


							    		l++;
							    		setLike(l);
							    	}
							    	else
							    	{
							    		final[x].count=c;
							    		c=0;
							    		x++;
										add(x);
							    	}
							    }
							    setLike(0)

							})
							
						}
						else
						{
							if(final.length>0)	
								res.send(final);
							else	
								res.send({privacy:noPostReason});
						}
					}
					add(0);
	    		}
	    	}
	    	fetch_post(0);
	    }
	    else
	    {
    		res.send(final);
	    }		    
  	});
})

app.post('/sendFriendRequests',function(req,res)
{

  dbo.collection("friendrequests").insertOne({...req.body}, function(err, friends) 
	{
	    if (err) throw err;
	   
	   console.log("friend req send successfully");
	   res.send(friends);
	});
})

app.post('/fetchFriendRequests',function(req,res)
{
  dbo.collection("friendrequests").find({to:req.body.mail}).toArray(function(err, friends) 
	{
	    if (err) throw err;	   
	   if(friends.length>0)
	   {
	   		function fetch_req(i)
	   		{
	   			if(i<friends.length)
	   			{
	   				 dbo.collection("users").findOne({mail:friends[i].from},function(err, user) 
					 {
					    if (err) throw err;
					    friends[i].name=user.name;

					  //   dbo.collection("privacy").findOne({mail:user.mail},function(err,privacy){
							// if(err) throw err;
							// 	console.log(privacy)
							if(user.privacy&&user.privacy=="Hide from everyone")
							{
								user.gender=='Male'?user.image='male.jpg':user.image='female.jpg'	
							    var filePath = path.join(__dirname, '/profile/' +user.image);															
								var data = fs.readFileSync(filePath);
								user.image='data:image/png;base64,' + data.toString('base64');
								 friends[i].image=user.image;	
								i++;
								fetch_req(i);
							}
							else if(user.privacy&&user.privacy=="Show to Friends only")
							{
								user.gender=='Male'?user.image='male.jpg':user.image='female.jpg'	
							    var filePath = path.join(__dirname, '/profile/' +user.image);															
								var data = fs.readFileSync(filePath);
								user.image='data:image/png;base64,' + data.toString('base64');
								 friends[i].image=user.image;	
								i++;
								fetch_req(i);
							}
					 		else{									
								    if(user.image=="")
								    {
								    	user.gender=='Male'?user.image='male.jpg':user.image='female.jpg'	
									    var filePath = path.join(__dirname, '/profile/' +user.image);															
										var data = fs.readFileSync(filePath);
										user.image='data:image/png;base64,' + data.toString('base64');
										 friends[i].image=user.image;	
										i++;
										fetch_req(i);
								    }
								    else
								    {
								    	 friends[i].image=user.image;	
										i++;
										fetch_req(i);
								    } 
						   		 } 	
				   		 	})	
					    		    
				  	// });
	   			}
	   			else
	   			{
	   				res.send(friends);
	   			}
	   		}

	   		fetch_req(0);
	   }
	   else
	   {
	   	res.send([]);
	   }
	});
})

app.post('/acceptFriendRequest',function(req,res)
{

  dbo.collection("friends").insertOne({user:req.body.user,friend:req.body.friend}, function(err, friends) 
	{
	    if (err) throw err;
	   
	    dbo.collection("friends").insertOne({user:req.body.friend,friend:req.body.user}, function(err, friends) 
		{
		    if (err) throw err;
		   	
		   	console.log('friends inserted');
		   	 dbo.collection("friendrequests").
		   	 deleteOne({$or:[{from:req.body.user,to:req.body.friend},
		   	 	{from:req.body.friend,to:req.body.user}]}, function(err, friends) 
				{
				    if (err) throw err;
				    console.log("req deleted");
				   	res.send(friends);
				    
				});	

		});
	});
})


app.post('/delFriendRequest',function(req,res)
{

  dbo.collection("friendrequests").deleteOne({...req.body}, function(err, friends) 
	{
	    if (err) throw err;
	    console.log("req deleted");
	   	res.send(friends);
	    
	});
})

app.post('/countFriendRequest',function(req,res)
{

	dbo.collection('friendrequests').find({to:req.body.mail}).count(function(err,result)
	{
		if(err) throw err;
		res.send({count:result});
	})
})

app.post('/removeFriend',function(req,res)
{

  dbo.collection("friends").
  deleteOne({ $or: [ {user:req.body.user,friend:req.body.friend},{friend:req.body.user,user:req.body.friend} ] }, function(err, friends) 
	{
	    if (err) throw err;
	dbo.collection("friends").
	  deleteOne({ $or: [ {user:req.body.user,friend:req.body.friend},{friend:req.body.user,user:req.body.friend} ] }, function(err, friends) 
		{
		    if (err) throw err;
		    res.send(friends);
	  });
	    
	});
})


app.post('/fetchFriends',function(req,res)
{

  dbo.collection("friends").find({user:req.body.user}).toArray(function(err,friends)
  {
 		    if (err) throw err;
		     if(friends.length>0)
			   {
			   		function fetch_req(i)
			   		{
			   			if(i<friends.length)
			   			{
			   				 dbo.collection("users").findOne({mail:friends[i].friend},function(err, user) 
							 {
							    if (err) throw err;
							    friends[i].name=user.name;
							    if(users[user.mail]&&user.mail!=req.body.user)
							    {
							    	friends[i].connection="online";
							    }
							    else
							    {
							    	friends[i].connection="offline";
							    }
						  //     dbo.collection("privacy").findOne({mail:user.mail},function(err,privacy){
								// if(err) throw err;
								// 	console.log(privacy)
								if(user.privacy&&user.privacy=="Hide from everyone")
								{
									user.gender=='Male'?user.image='male.jpg':user.image='female.jpg'	
								    var filePath = path.join(__dirname, '/profile/' +user.image);															
									var data = fs.readFileSync(filePath);
									user.image='data:image/png;base64,' + data.toString('base64');
									 friends[i].image=user.image;	
									i++;
									fetch_req(i);
								}
								else if(user.privacy&&user.privacy=="Show to Friends only")
								{
									dbo.collection("friends").findOne({$and:[{"user":req.body.user},{"friend":user.mail}]},function(err, checkfriend) 
					 				{
					 					if(!checkfriend)
					 					{
					 						user.gender=='Male'?user.image='male.jpg':user.image='female.jpg'	
										    var filePath = path.join(__dirname, '/profile/' +user.image);															
											var data = fs.readFileSync(filePath);
											user.image='data:image/png;base64,' + data.toString('base64');
											friends[i].image=user.image;	
											i++;
											fetch_req(i);
					 					}
					 					else
					 					{
					 						if(user.image=="")
										    {
										    	user.gender=='Male'?user.image='male.jpg':user.image='female.jpg'	
											    var filePath = path.join(__dirname, '/profile/' +user.image);															
												var data = fs.readFileSync(filePath);
												user.image='data:image/png;base64,' + data.toString('base64');
												friends[i].image=user.image;	
												i++;
												fetch_req(i);
										    }
										    else
										    {
										    	friends[i].image=user.image;	
												i++;
												fetch_req(i);
										    } 
					 					}
					 				})	
								}
						 		else{									
									    if(user.image=="")
									    {
									    	user.gender=='Male'?user.image='male.jpg':user.image='female.jpg'	
										    var filePath = path.join(__dirname, '/profile/' +user.image);															
											var data = fs.readFileSync(filePath);
											user.image='data:image/png;base64,' + data.toString('base64');
											 friends[i].image=user.image;	
											i++;
											fetch_req(i);
									    }
									    else
									    {
									    	 friends[i].image=user.image;	
											i++;
											fetch_req(i);
									    } 
							   		 } 	
				   		 		// })    
					  		});
			   			}
			   			else
			   			{
			   				res.send(friends);
			   			}
			   		}

			   		fetch_req(0);
			   }
			   else
			   {
			   	res.send([]);
			   }
	  });	    
})

app.post('/countFriends',function(req,res)
{
	dbo.collection('friends').find({user:req.body.user}).count({},function(err,result)
	{
		if(err) throw err;
		res.send({count:result});
	}) 
	
  
})

app.post('/setProfilePrivacy',function(req,res)
{
	dbo.collection('users').updateOne({mail:req.body.mail},{$set:{privacy:req.body.privacy}},function(err,result)
	{
		if(err) throw err;
		
		res.send(result);
	}) 
	
  
})

app.post('/getProfilePrivacy',function(req,res)
{
	dbo.collection('users').findOne({mail:req.body.mail},function(err,result)
	{
		if(err) throw err;
		console.log(result)
		if(result)
			res.send({privacy:result.privacy});
		else
			res.send({});
		
	})
	
})

app.post('/setPostPrivacy',function(req,res)
{
	var myquery = {mail:req.body.mail};
    var newvalues = { $set: {privacy:req.body.privacy}};
    dbo.collection('users').updateOne(myquery,{ $set: {post_privacy:req.body.privacy}},function(err,privacy)
	{
		if(err) throw err;
		dbo.collection('posts').updateMany({$and:[{mail:req.body.mail},{type:{$ne:"public"}}]},newvalues,function(err,post)
		{
			if(err) throw err;
			
			res.send(post);
		})
	}) 
	 
})

app.post('/getPostPrivacy',function(req,res)
{
	
	dbo.collection('users').findOne({mail:req.body.mail},function(err,result)
	{
		if(err) throw err;
		if(result)
			res.send({privacy:result.post_privacy});
		else
			res.send({});
	}) 	
})

app.post('/getMessages',function(req,res)
{
	
	dbo.collection('messages').find({from:req.body.user,to:req.body.friend}).toArray(function(err,result)
	{
		if(err) throw err;

		if(result.length>0)
			res.send(result);
		else
			res.send([]);
	}) 	
})

app.post('/countChat',function(req,res)
{
	dbo.collection('messages').find({to:req.body.mail,visibility:'unseen'}).count(function(err,result)
	{
		if(err) throw err;
		res.send({count:result});
	}) 	
})

app.post('/fetchChats',function(req,res)
{
	var final=[];
	var mail="";
	dbo.collection('chats').find({$or:[{p1:req.body.mail},{p2:req.body.mail}]}).sort({time:-1}).toArray(function(err,friends)
	{
		if(err) throw err;
		if(friends.length>0)
			   {
			   		function fetch_req(i)
			   		{
			   			if(i<friends.length)
			   			{
			   				if(friends[i].p1!=req.body.mail)
			   				{
			   					mail=friends[i].p1;
			   					 dbo.collection("messages").find({from:mail,visibility:"unseen",to:friends[i].p2}).count(function(err, count) 
								 {
								 	console.log("count1 "+count);
								 	if(count&&count>0)
								 		friends[i].count=count;
								 })
			   				}
			   				else
			   				{
			   					mail=friends[i].p2;
			   					 dbo.collection("messages").find({from:mail,visibility:"unseen",to:friends[i].p1}).count(function(err, count) 
								 {
								 	console.log("count2 "+count);
								 	if(count&&count>0)
								 		friends[i].count=count;
								 })
			   				}
			   				friends[i].mail=mail;

			   				 dbo.collection("users").findOne({mail:mail},function(err, user) 
							 {
							    if (err) throw err;
							    friends[i].name=user.name;
							    if(users[user.mail]&&user.mail!=req.body.user)
							    {
							    	friends[i].connection="online";
							    }
							    else
							    {
							    	friends[i].connection="offline";
							    }
						  //     dbo.collection("privacy").findOne({mail:user.mail},function(err,privacy){
								// if(err) throw err;
								// 	console.log(privacy)
								if(user.privacy&&user.privacy=="Hide from everyone")
								{
									user.gender=='Male'?user.image='male.jpg':user.image='female.jpg'	
								    var filePath = path.join(__dirname, '/profile/' +user.image);															
									var data = fs.readFileSync(filePath);
									user.image='data:image/png;base64,' + data.toString('base64');
									 friends[i].image=user.image;
									 final.push(friends[i]);	
									i++;
									fetch_req(i);
								}
								else if(user.privacy&&user.privacy=="Show to Friends only")
								{
									dbo.collection("friends").findOne({$and:[{"user":req.body.mail},{"friend":user.mail}]},function(err, checkfriend) 
					 				{
					 					if(!checkfriend)
					 					{
					 						user.gender=='Male'?user.image='male.jpg':user.image='female.jpg'	
										    var filePath = path.join(__dirname, '/profile/' +user.image);															
											var data = fs.readFileSync(filePath);
											user.image='data:image/png;base64,' + data.toString('base64');
											friends[i].image=user.image;
											final.push(friends[i]);	
											i++;
											fetch_req(i);
					 					}
					 					else
					 					{
					 						if(user.image=="")
										    {
										    	user.gender=='Male'?user.image='male.jpg':user.image='female.jpg'	
											    var filePath = path.join(__dirname, '/profile/' +user.image);															
												var data = fs.readFileSync(filePath);
												user.image='data:image/png;base64,' + data.toString('base64');
												friends[i].image=user.image;
												final.push(friends[i]);	
												i++;
												fetch_req(i);
										    }
										    else
										    {
										    	friends[i].image=user.image;
										    	final.push(friends[i]);	
												i++;
												fetch_req(i);
										    } 
					 					}
					 				})	
								}
						 		else{	
									    if(user.image=="")
									    {
									    	user.gender=='Male'?user.image='male.jpg':user.image='female.jpg'	
										    var filePath = path.join(__dirname, '/profile/' +user.image);															
											var data = fs.readFileSync(filePath);
											user.image='data:image/png;base64,' + data.toString('base64');
											 friends[i].image=user.image;
											 final.push(friends[i]);	
											i++;
											fetch_req(i);
									    }
									    else
									    {
									    	 friends[i].image=user.image;	
									    	 final.push(friends[i]);
											i++;
											fetch_req(i);
									    } 
							   		 } 	
				   		 		// })    
					  		});
					  	// 	else
					  	// 	{
					  	// 		i++;
								// fetch_req(i);
					  	// 	}
			   			}
			   			else
			   			{
			   				res.send(final);
			   			}
			   		}

			   		fetch_req(0);
			   }
			   else
			   {
			   	res.send([]);
			   }
	}) 	
})


app.post('/selfPosts',function(req,res)
{
	var final=[];
	 dbo.collection("posts").find({"mail":req.body.mail}).sort({time:-1}).toArray(function(err, posts) 
	 {
	    if (err) throw err;
	    if(posts.length>0)
	    {
	    	function fetch_post(i)
	    	{
	    		if(i<posts.length)
	    		{

	    			if(posts[i].sharedFrom!=undefined)
					{
						dbo.collection("users").find({mail:posts[i].sharedFrom}).project({name:1,mail:1}).toArray(function(err, share) 
												 
						{
						    if (err) throw err;
						    	if(share[0].mail==req.body.user)
						    	{
						    		posts[i].sharer="Your";
						    	}
						    	if(share[0].mail!=req.body.user)
						    		posts[i].sharer=share[0].name;
							
						 }) 	
					}
	    			function formatAMPM(time) {
					  var date=new Date(time);
					  var hours = date.getHours();
					  var minutes = date.getMinutes();
					  var ampm = hours >= 12 ? 'pm' : 'am';
					  hours = hours % 12;
					  hours = hours ? hours : 12; // the hour '0' should be '12'
					  minutes = minutes < 10 ? '0'+minutes : minutes;
					  var strTime = hours + ':' + minutes + ' ' + ampm;
					  // return strTime;
					  posts[i].post_time=strTime;
					}

					(formatAMPM(posts[i].time));
					const monthNames = ["January", "February", "March", "April", "May", "June",
				        "July", "August", "September", "October", "November", "December"];
				    let dateObj = new Date(posts[i].time);
				    let month = monthNames[dateObj.getMonth()];
				    let day = String(dateObj.getDate()).padStart(2, '0');
				    let year = dateObj.getFullYear();
				    let output = day  + ' '+ month  + ' ' + year;
					posts[i].post_date=output;
					posts[i].name="You";
					dbo.collection("users").findOne({"mail":posts[i].mail},function(err,user)
	    			{
    					if(user.image=="")
						    {
						    	user.gender=='Male'?user.image='male.jpg':user.image='female.jpg'	
							    var filePath = path.join(__dirname, '/profile/' +user.image);															
								var data = fs.readFileSync(filePath);
								user.image='data:image/png;base64,' + data.toString('base64');
								posts[i].image=user.image;	
								
								final.push(posts[i]);
								i++;
								fetch_post(i);
						    }
						    else
						    {
						    	posts[i].image=user.image;	
						    	final.push(posts[i]);
						    	i++;
								fetch_post(i);
						    }
    				})
					
				}
				else
	    		{
	    			var c=0;
					function add(x)
					{
						if(x<final.length)
						{
								dbo.collection("likes").find({like:1}).toArray (function(err, likes) 
							{
							    if (err) throw err;

							    function setLike(l)
							    {
							    	if(l<likes.length)
							    	{
							    		// console.log(k);
							    		if(final[x]._id==likes[l].post_id)
							    		{
							    			c++;
							    		}
							    		if(likes[l].post_id==final[x]._id&&likes[l].mail==req.body.mail)
							    		{
							    			
							    	
							    			final[x].like=likes[l].like;
							    		}


							    		l++;
							    		setLike(l);
							    	}
							    	else
							    	{
							    		final[x].count=c;
							    		c=0;
							    		x++;
										add(x);
							    	}
							    }
							    setLike(0)

							})
							
						}
						else
						{
							res.send(final);
						}
					}
					add(0);
	    		}
			}
			fetch_post(0);
		}
		else
			res.send([]);
	})
})


app.post('/delPost',function(req,res)
{
	dbo.collection('posts').deleteOne({_id: new mongodb.ObjectID(req.body.id)},function(err,result)
	{
		if(err) throw err;
		dbo.collection('likes').deleteMany({post_id: req.body.id},function(err,result)
		{
			res.send(result);	
		})
		
	}) 	
})


app.post('/notifications',function(req,res)
{
	var notifications=[];

	var notify={
		text:'',
		time:'',
		post_id:''
	};
	 dbo.collection("notifications").find({$or:[{post_mail:req.body.mail,user:req.body.mail},
	 	{mail:req.body.mail,user:req.body.mail}]}).sort({time:-1}).toArray(function(err, likes) 
	{
	    if (err) throw err;
	   	if(likes.length>0)
	   	{
	   		function fetch_notify(i)
	   		{
	   			if(i<likes.length)
	   			{	
	   				 {
	   				 	dbo.collection("users").findOne({mail:likes[i].mail},function(err, user) 
							{
								if(user.mail==req.body.mail)
									notify.text="You";
								else	
									notify.text=user.name;
								if(likes[i].like==1)
				   				{
				   					notify.text+=" liked ";
				   					likePost();
				   				}
				   				else 
				   				{
				   					notify.text+=" disliked "
				   					likePost();
				   				} 
				   				if(likes[i].like==undefined||!likes[i].like)
				   				{
				   					notify.text+=" uploaded a post"
				   					i++;
				   					fetch_notify(i);
				   				}

				   				function likePost()	
								{ dbo.collection("posts").findOne({_id:new mongodb.ObjectID(likes[i].post_id)},function(err, post) 
																{
																	 dbo.collection("users").findOne({mail:post.mail},function(err, user) 
																	{
																		if(user.mail==req.body.mail)
																			notify.text+="your post, ";
																		else
																			notify.text+=user.name+"'s post, ";
														   				 notify.post_id=post._id;	
																		function formatAMPM(time) {
																		  var date=new Date(time);
																		  var hours = date.getHours();
																		  var minutes = date.getMinutes();
																		  var ampm = hours >= 12 ? 'pm' : 'am';
																		  hours = hours % 12;
																		  hours = hours ? hours : 12; // the hour '0' should be '12'
																		  minutes = minutes < 10 ? '0'+minutes : minutes;
																		  var strTime = hours + ':' + minutes + ' ' + ampm;
																		  notify.text+=" ,time: "+strTime;
																		}
								
																		const monthNames = ["January", "February", "March", "April", "May", "June",
																	        "July", "August", "September", "October", "November", "December"];
																	    let dateObj = new Date(post.time);
																	    let month = monthNames[dateObj.getMonth()];
																	    let day = String(dateObj.getDate()).padStart(2, '0');
																	    let year = dateObj.getFullYear();
																	    let output = day  + ' '+ month  + ' ' + year;
																		notify.text+="posted on "+output;
																		(formatAMPM(post.time));
																		
																		 var t=Math.floor((new Date().getTime()-likes[i].time)/60000);
																		 if(t>=60)
																		 	 {
																		 	 	t=Math.floor((new Date().getTime()-likes[i].time)/(60*60000));
																		 	 	if(t>=24)
																		 	 		t=Math.floor((new Date().getTime()-likes[i].time)/(60*60000*24))+" days";
																		 	 	else
																		 	 		t+=" hrs";
																		 	 }
																		 else
																		 	t+=" mins";
														   				 notify.time=t;
														   				 notifications.push(notify);
														   				 notify={};
														   				 i++;
														   				 fetch_notify(i)
																	})
								
																})}
							})
	   				 }
	   			
	   			
	   			}
	   			else
	   			{
	   				var myquery = {user:req.body.mail};
			  	  	var newvalues1 = { $set: {visibility:'seen'}};
				  	
					dbo.collection("notifications").updateMany(myquery, newvalues1, function(err, result) 
					{
					    if (err) throw err;
						res.send(notifications);	
					})
				  		
				 
	   				
	   			}
	   		}
	   		fetch_notify(0);
	   	}
	   	else
	   	{
	   		res.send([]);
	   	}
	})
})



app.post('/getPost',function(req,res)
{
	dbo.collection('posts').findOne({_id: new mongodb.ObjectID(req.body.id)},function(err,post)
	{
		if(err) throw err;
		
		dbo.collection('users').findOne({mail: post.mail},function(err,users)
		{
			if(err) throw err;
			if(users)
			{
				post.name=users.name;
				if((users.privacy&&users.privacy=="Show to Friends only")||(users.privacy&&users.privacy=="Show to everyone")
					||(users.mail==req.body.mail))
				{
				 
				  	if(users.image=="")
				    {
				    	users.gender=='Male'?users.image='male.jpg':users.image='female.jpg'	
					    var filePath = path.join(__dirname, '/profile/' +users.image);															
						var data = fs.readFileSync(filePath);
						users.image='data:image/png;base64,' + data.toString('base64');
						post.image=users.image;	
				    }
				    else
				    {
				    	post.image=users.image;
				    }
				}
				else
				{
						users.gender=='Male'?users.image='male.jpg':users.image='female.jpg'	
					    var filePath = path.join(__dirname, '/profile/' +users.image);															
						var data = fs.readFileSync(filePath);
						users.image='data:image/png;base64,' + data.toString('base64');
						post.image=users.image;	
				}
 			
				res.send(post);
			}
		})
	}) 	
})

app.post('/countNotify',function(req,res)
{
	dbo.collection('notifications').find({$or:[{visibility:'unseen',user:req.body.mail}]}).count(function(err,result)
	{
		if(err) throw err;
		console.log("ccc "+result);
		res.send({count:result});
	}) 	
})
