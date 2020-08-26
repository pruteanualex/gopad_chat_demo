const users = [];

//Jpin User to chat
exports.userJoin = (id,username,enteprise) =>{
   const user = {id,username,enteprise}

   users.push(user);
   return user;
}

//Get Current User
exports.getCurrentUser = (id)=>{
   return users.find(user =>user.id === id);
}

//User Leavs chat 
exports.userLeave = (id)=>{
   const index = users.findIndex(user =>user.id === id);
   if(index !== -1){
      return users.splice(index,1)[0];
   }
}

//Get enteprise users
exports.getEntepriseUsers = (enteprise) =>{
   return users.filter(users => users.enteprise === enteprise);
}