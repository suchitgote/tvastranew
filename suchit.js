


const input = "suchit" ;


function run(input){
    var x = input ;
    var arrx = x.split("");
    console.log("arrx = " , arrx)
    for(var i = 0 ; i < arrx.length ; i++){
        var firstpart = arrx.slice(0, arrx.length-1);
        var secondpart = arrx[arrx.length - 1];
        var secondpartarrx = secondpart.split("");
        var arrx = secondpartarrx.concat(firstpart); 
        console.log("result = " , arrx)
    }
}

run(input)

