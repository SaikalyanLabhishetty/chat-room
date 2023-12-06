# chat-room

## Video Link : https://drive.google.com/file/d/1kuvC94TBZHBRk8kvu_zCa6puAfGpjddL/view?usp=sharing
## Server Side (server.js):
Setup:

### Express is used to create a web server.
Socket.IO is used for real-time bidirectional event-based communication.
Handling Connections:

### When a user connects (io.on('connection', ...)), the server sets up event listeners for that specific socket.
User Joining:

### When a user joins (socket.on('joinChat', ...)), the server sends a system message to notify all users about the new user.
The user is added to the room, and the user list for the room is updated and broadcasted.
User Exiting:

### When a user exits (socket.on('exitChat', ...)), the server sends a system message to notify all users about the exit.
The user is removed from the room, and the user list for the room is updated and broadcasted.
User Disconnecting:

### When a user disconnects (socket.on('disconnect', ...)), the server handles cleaning up and notifying users if needed.
Handling Chat Messages:

### When a chat message is received (socket.on('chatMessage', ...)), the server checks if the sender is the current user. If yes, it sends a custom acknowledgment system message; otherwise, it broadcasts the original message to all users.

## Client Side (client.js):
Setup:

### Connects to the Socket.IO server.
User Joining:

### When the user submits the username form, it sends a join request to the server.
The chat window is displayed, and the user list is updated.
Sending Messages:

### When the user sends a message (messageForm.addEventListener('submit', ...)), it emits a chatMessage event to the server.
If the message sender is not the current user, the message is displayed in the chat window.
User Exiting:

###When the user clicks the exit button, it sends an exit request to the server and updates the display accordingly.
Handling System Messages:

### System messages (user join/exit acknowledgments) are displayed differently in the chat window.
Updating User List:

The user list is updated based on events received from the server.
## HTML (index.html):
###Structure:

### Defines the structure of the chat room, including forms, messages, and user list.
Styling:
Applies basic CSS styling for a clean interface.

## Summary:
The server manages user connections, handles user join/exit events, and facilitates real-time chat communication. The client interfaces with the server, allowing users to join, send messages, exit, and receive real-time updates. The system ensures a dynamic and interactive chat experience.

