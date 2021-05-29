
// const url = "mongodb+srv://admin:admin123@cluster0.rztbg.mongodb.net/userdb?retryWrites=true&w=majority"
  



fetch('https://api.github.com/users/github')
    .then(res => res.json())
    .then(json => console.log(json));