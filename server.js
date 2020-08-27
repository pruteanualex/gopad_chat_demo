const path = require('path');
const http = require('http');
const express = require('express');
const dotenv = require('dotenv');
const socketio = require('socket.io');
const {formatMessage} = require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getEntepriseUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app)
const io = socketio(server);

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

dotenv.config({path:'./config.env'});

const botName  = 'GoPad Admin';
//Run when a client is contact
io.on('connection', socket=>{
   
    socket.on('joinRoom',({username, enteprise})=>{
       
        const user = userJoin(socket.id,username,enteprise);

        socket.join(user.enteprise)
        //Welcome current User
        socket.emit('message',formatMessage(botName,'Welcome to GoPad Chat'));

        //Broad When a user connects
        socket.broadcast.to(user.enteprise)
        .emit('message',formatMessage(botName,`${user.username} has join the cath`));

        //Send Users and enteprise info
        io.to(user.enteprise).emit('entepriseEnployees',{
            enteprise:user.enteprise,
            users:getEntepriseUsers(user.enteprise)
        });

    });
     //Listen for chatMessage
     socket.on('chatMessage',(msg)=>{
        const user = getCurrentUser(socket.id);
        io.to(user.enteprise).emit('message',formatMessage(user.username,msg));
    });
    //Run when clients is dosconected
    socket.on('disconnect',()=>{
         const user = userLeave(socket.id);
         if(user){
            io.to(user.enteprise)
            .emit('message', 
            formatMessage(botName,`${user.username} has left the chat`));
        
           //Send Users and enteprise info
        io.to(user.enteprise).emit('entepriseEnployees',{
            enteprise:user.enteprise,
            users:getEntepriseUsers(user.enteprise)
            
        });
        
        }

        
     });
    

});


// const port = 3000 || process.env.PORT;
// server.listen(port,()=> console.log(`Server is running ${port}`));
app.listen(process.env.PORT || 3000, function(){
    console.log(`Server is running ${port}`);
  });