
/*

var startingtime="10:00 AM";
var totime="01:09 PM";
var interval= 15;
console.log("starting time=", startingtime);
console.log("totime time=", totime);

console.log("interval time=", interval);


var sts = startingtime.slice(0,2);
var stss = parseInt(sts);
var aps= startingtime.slice(6,8)
if(aps=="PM" && stss != 12){ 
    stss = stss + 12;  
}
console.log("stss=",stss  )



var et = totime.slice(0,2);
var ets = parseInt(et);
var ap= totime.slice(6,8)
if(ap=="PM" && ets != 12){ 
    ets = ets + 12;  
}
console.log("ets=",ets)



var smin = startingtime.slice(3,5);
var smin = parseInt(smin);
var hsmin = stss*60 ;
var tsmin = hsmin  + smin ;
console.log("hsmin=",hsmin  )
console.log("smin=",smin  )
console.log("tsmin=",tsmin  )

var emin = totime.slice(3,5);
var emin = parseInt(emin);
var hemin = ets*60 ;
var temin = hemin  + emin ;
console.log("hemin=",hemin  )
console.log("emin=",emin  )
console.log("temin=",temin  )





var noslots = ( temin - tsmin )  / interval ;
console.log(`noslots = ( ${temin} - ${tsmin} ) / ${interval} =`,( temin - tsmin) / interval)

noslots =parseInt (noslots.toFixed(0))
console.log("noslots=",noslots)

var slots = [];
for (i=0; i < noslots; i++)
{
    console.log("i=",i)

    var hour = startingtime.slice(0,2);
    console.log("hour=", hour)
    var min = startingtime.slice(3,5);
    var ampm= startingtime.slice(6,8);
    var hours = parseInt(hour);

    console.log("hours=",hours)
    if(ampm=="PM" && hours != 12)
    {
        hours = hours + 12;
    }
    var mins = parseInt(min);
    console.log("mins =",mins)

    var sum = interval + mins;

    if(interval==60){
        hours = hours + 1;
        sum = sum - 60;
    }else if((sum/60) >= 1) {
        hours = hours + 1 ;
        sum = sum - 60;
    }
    else if (sum==60) {
        hours = hours + 1;
        sum = sum - 60;
    }
    var result ;
    if(hours >= 12) {
        hours = hours - 12 ;
        if(sum < 10){
            result = "0" + `${hours}` + ":" + `0${sum}` + " " + "PM";
        }else{
            result = "0" + `${hours}` + ":" + `${sum}` + " " + "PM";
        }
    }else {
        if(hours == 10 || hours == 11){
            if(sum < 10){
                result = `${hours}` + ":" + `0${sum}` + " " + "AM";
            }else{
                result = `${hours}` + ":" + `${sum}` + " " + "AM";
            }
        }else{
            if(sum < 10){
                result ="0" + `${hours}` + ":" + `0${sum}` + " " + "AM";
            }else{
                result ="0" + `${hours}` + ":" + `${sum}` + " " + "AM";
            }
        }
    }
    console.log("result=", result);
    if(i == (noslots - 1)){
        if(startingtime.slice(0,2) == "00"){
            var replace3 = startingtime.replace("00","12");
            slots.push(`${replace3} - ${totime} `)
        }else{
            slots.push(`${startingtime} - ${totime} `)
        }
    }else{
        if(startingtime.slice(0,2) == "00"){
            var replace = startingtime.replace("00","12");
            if(result.slice(0,2) == "00"){
                var replace1 = result.replace("00","12");
                slots.push(`${replace} - ${replace1}`)
            }else{
                slots.push(`${replace} - ${result}`)
            }
        }else if(result.slice(0,2) == "00"){
            var replace2 = result.replace("00","12");
            slots.push(`${startingtime} - ${replace2}`)
        }else{
            slots.push(`${startingtime} - ${result}`)
        }
    }
    startingtime = result;
    console.log("new starting time=", startingtime)

}

console.log("slots = ",slots);


var emtarr = [];
for(var k = 0 ; k < slots.length ; k++ ){
    emtarr.push({
        id:k,
        schedule_time:slots[k],
        checkbox:true
    })
}

console.log("emtarr =",emtarr);

*/


var days = [["1m"],["2t"],["3w"],["4th"],["5f"],["6sa"]]

// var d = new Date();
// var n = d.getDay()
// console.log("n = ",n); 
n = 3;
var newdays = [];
for(var x = 0 ; x < days.length ; x++){

    if(n == 0 || n == 7){
            console.log("x,n = ",x,n)
            newdays.push([])
            console.log("newdays = ",newdays)
        n++ ;
    }
    if(n > days.length){
        console.log("x,n = ",x,n)
        newdays.push(days[n - (days.length + 1 + 1)])
        console.log("newdays = ",newdays)
        n++ ;
    }else{
        console.log("x,n = ",x,n)
        newdays.push(days[n-1])
        console.log("newdays = ",newdays)
        n++ ;
    }
}

console.log("newdays = ",newdays)









