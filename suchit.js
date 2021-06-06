
var input = "aababb";
console.log("input=",input);

var ss= 4;
var nob = 2;
function small(input,ss,nob){
    var inpuitlength = input.length ; 
    var ans = [];
    for(var i=0;i<= (inpuitlength - ss) ;i++){
        console.log("i",i);


    while(input.length >= ss){
            console.log("whi................");

            var subs = input.slice(i,i+ss);
            var subsarr = subs.split("");
            console.log("subs",subs);
            console.log("subsarr",subsarr);
            var c=0;

            for(var j=0;j< subsarr.length;j++){
                if(subsarr[j] == "b"){
                    c++ ;
                }
            }
                for(var k=0;k< ans.length;k++){
                    if(ans[k] == subs){
                        console.log("dont push");
                        k = ans.length;
                        push=0;
                    console.log("push",push);
                    }
                }
                    if(subsarr.length == 4 && c >= 2 ){
                        ans.push(subs)
                        console.log("push");
                        console.log("ans",ans);
                    }
            
            input = input.slice(0,3) + input.slice(4,6)
            console.log("input",input);

        }
            console.log("ans",ans);
            console.log("......................................");

    }
}

small(input,ss,nob);