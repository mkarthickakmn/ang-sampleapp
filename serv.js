// const fun=(callback)=>{
// 	setTimeout(()=>{callback(undefined, (1+2))},2000)
// }

 
// fun((error,result)=>{
// 	console.log(result);
// })

const fun=(a,b)=>{
	return new Promise((resolve,reject)=>{
		setTimeout(()=>{
			resolve(a+b)
		},1000)
	});
}

// fun(10,2).then(data1=>{
// 	return fun(data1,1)
// }).then(data2=>{
// 	return fun(11,data2)
// }).then(data=>{
// 	console.log(data);
// })
// .catch(e=>
// {
// 	console.log(e);
// })

dowork=async()=>{
	x=await fun(1,2)
	x=await fun(x,4)
	x=await fun(x,5)
	return x;
}

dowork().then(data=>{
	console.log(data);
})
.catch(e=>
{
	console.log(e);
})