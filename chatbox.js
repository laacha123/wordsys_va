// Create the CSS styles and append to the document head

const styles = `

body {

    font-family: Arial, sans-serif;

    margin: 0;

    padding: 0;

    background-color: #f4f4f4;

}

.chat-icon {

    position: fixed;

    bottom: 20px;

    right: 20px;

    background-color: #007aff;

    color: white;

    border-radius: 50%;

    padding: 15px;

    cursor: pointer;

    font-size: 24px;

    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

    transition: background-color 0.3s;

     

}

.chat-icon  img{transform:rotateY(0deg);

     transition:.5s;}



.chat-icon-n{display:inline-flex;}

.chat-icon-h{display:none;}

// .chat-icon-togggle .chat-icon-n{ display:none;}

// .chat-icon-togggle .chat-icon-h{display:inline-flex;}

.chat-icon:hover {

    background-color: var(--secondary); 

}

.chat-icon:hover  img{ transform:rotateY(180deg);}

.chat-box {

    position: fixed;

    bottom: 80px;

    right: 20px;

    width: 400px;

    height: 400px;

    background-color: white;

    border-radius: 10px;

    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);

    display: none;

    flex-direction: column;

    overflow: hidden;

    z-index:123;

}

.chat-header {

    background-color: #0063cf;

    color: white;

    padding: 10px;

    display: flex;

    justify-content: space-between;

    align-items: center;

}

.chat-header h3 {

    margin: 0;

    color:#fff;

}

.close-chat {

        cursor: pointer;

    font-size: 16px;

    background: #fff;

    width: 25px;

    height: 25px;

    color: var(--secondary);

    display: inline-flex;

    align-items: center;

    justify-content: center;

    border-radius: 50%;

    font-weight: bold;

    line-height: 20px;

}

.close-chat:hover{

    background:var(--secondary);

    color:#fff;

}

.chat-content {

    padding: 10px;

    height: 280px;

    overflow-y: auto;

    border-bottom: 1px solid #ddd;

    flex-grow: 1;

}

.message {

    margin-bottom: 10px;

}

.message{text-align:right;}
.message >div{ 
    display: inline-block;
    padding: 10px;
    border-radius: 13px;
    font-size: 16px;
    line-height: 26px;
    background: #b9d4ff;

}
.message.bot_message{text-align:left;}
.message.bot_message >div{
        background: navajowhite;
}

.chat-input {

    display: flex;

    padding: 10px;

    background:none;

    border: none;

    position: absolute;

    bottom: 0;

    width: 100%;

    box-sizing: border-box;

}

.chat-input input {

    flex: 1;

    padding: 10px;

    font-size:15px;

    line-height:20px;

    border: 1px solid #ccc; 

    margin-right: 0;

    height: auto;

    border-radius: 25px 0 0 25px;

    border-right: none;

}

.chat-input input:focus{

    outline:none;

}

.chat-input button {

    padding: 10px 20px;

    border-radius:0 25px  25px 0 ;

    font-size:15px;

    line-height:20px;

    background-color: var(--secondary);

    color: white;

    border: none; 

    cursor: pointer;

    transition: background-color 0.3s;

    height: auto;

}

.chat-input button:hover {

    background-color: #87CEEB;

}

@media (max-width:550px){
    .chat-box{
            right: 5px;
     width: 300px;
    }
    .message >div{
        font-size:13px;
        line-height:20px;
    }
}

`;



// Append styles to the head

const styleSheet = document.createElement("style");

styleSheet.type = "text/css";

styleSheet.innerText = styles;

document.head.appendChild(styleSheet);





// chatIconid.addEventListener('click', function() {

  

  // el.classList.toggle('chat-icon-togggle');

// });



// Create chat box HTML

const chatBoxHTML = `

<div class="chat-icon" id="chatIcon">

    <img class="chat-icon-n" src="https://wordsystech.com/webdesign/wp-content/themes/wordsys/assets/images/chatico.svg"/>

   <!-- <img class="chat-icon-h" src="https://wordsystech.com/webdesign/wp-content/themes/wordsys/assets/images/chatcross.svg"/>-->

</div>

<div class="chat-box" id="chatBox">

    <div class="chat-header">

        <h3>Chat with us</h3>

        <span class="close-chat" id="closeChat">x</span>

    </div>

    <div class="chat-content" id="chatContent">

        <!-- Chat messages will appear here -->

    </div>

    <div class="chat-input">

        <input type="text" id="userInput" placeholder="Type your message...">

        <button id="sendBtn">Send</button>

    </div>

</div>

`;





 

// Ensure DOM is fully loaded before manipulating it

document.addEventListener('DOMContentLoaded', function() {

    // Append chat box to the body

    const chatBoxContainer = document.createElement("div");

    chatBoxContainer.innerHTML = chatBoxHTML;

    document.body.appendChild(chatBoxContainer);



    // Add event listeners for chat functionality

    document.getElementById('chatIcon').addEventListener('click', function() {

        document.getElementById('chatBox').style.display = 'block';



    });



    document.getElementById('closeChat').addEventListener('click', function() {

        document.getElementById('chatBox').style.display = 'none';

    });



    // Initialize Socket.IO connection

    const socket = io('https://va.wordsystech.com', {

        withCredentials: true

    });  

    // Replace with your actual Flask app URL

    let chatHistory = '';



    document.getElementById('sendBtn').addEventListener('click', function() {

        sendMessage();

    });



    document.getElementById('userInput').addEventListener('keypress', function(e) {

        if (e.key === 'Enter') {

            sendMessage();

        }

    });



    socket.on('bot_message', function(data) {

        const message = data.message;

        displayMessage('Bot', message);

        chatHistory += `Bot: ${message}\n`;

    });



    function sendMessage() {

        const userInput = document.getElementById('userInput').value;

    

        

        if (userInput.trim() !== '') {

            displayMessage('You', userInput);

            chatHistory += `User: ${userInput}\n`;

            socket.emit('user_message', { message: userInput, history: chatHistory });

            document.getElementById('userInput').value = '';

             

        }

    }



    function displayMessage(sender, message) {

        const chatContent = document.getElementById('chatContent');

        const messageElement = document.createElement('div');

        messageElement.classList.add('message');

        messageElement.innerHTML = `<div><strong>${sender}:</strong> ${message}</div>`;

        chatContent.appendChild(messageElement);

        chatContent.scrollTop = chatContent.scrollHeight;

        

    } 

    function displayMessage(sender, message) {
        const chatContent = document.getElementById('chatContent');
        const messageElement = document.createElement('div');

        // Add a class based on whether the message is from the bot or the user
        messageElement.classList.add('message');
        
        if (sender === 'Bot') {
            messageElement.classList.add('bot_message'); // Add the bot_message class for bot messages
        }

        messageElement.innerHTML = `<div><strong>${sender}:</strong> ${message}</div>`;
        chatContent.appendChild(messageElement);
        chatContent.scrollTop = chatContent.scrollHeight;
    }


});
