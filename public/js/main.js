const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const entepriseN = document.getElementById('room-name');
const usersN = document.getElementById('users');

//Get Username and room from url

const {username, enteprise} =  Qs.parse(location.search,{
    ignoreQueryPrefix:true
});

//Initialling Socket In Front End
const socket = io();

//Join Chat Room
socket.emit('joinRoom', {username, enteprise});

//Get room and users
socket.on('entepriseEnployees',({enteprise,users}) =>{
   outputEntName(enteprise),
   outputUsrName(users); 
});

//This is message From Server
socket.on('message',message =>{
   console.log(message);
   outputMessage(message);


   //Scroll Down 
   chatMessage.scrollTop = chatMessage.scrollHeight;
   //Clear Input
});


//Message submit
chatForm.addEventListener('submit', (e)=>{
     e.preventDefault();
      
     //Get message text
     const msg = e.target.elements.msg.value;

     //Clear Message
     e.target.elements.msg.value = '';
     e.target.elements.msg.focus();
     //Emit message to server
     socket.emit('chatMessage',msg);
     
});


//Output message to dom
const outputMessage = (message)=>{
   const div = document.createElement('div');
   div.classList.add('message');
   div.innerHTML = `
     <p class="meta">${message.username}<span> ${message.time}</span></p>
     <p class="text">
          ${message.text}
     </p>
   `;

    document.querySelector('.chat-messages').appendChild(div);
} 



const outputEntName = (enteprise)=>{
    entepriseN.innerText = enteprise;
};

const outputUsrName = (users)=>{
   
    usersN.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join(' ')}`; 
}






// https://www.youtube.com/watch?v=jD7FnbI76Hg