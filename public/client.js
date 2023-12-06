document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  const usernameForm = document.getElementById('usernameForm');
  const messageForm = document.getElementById('messageForm');
  const messageInput = document.getElementById('messageInput');
  const messages = document.getElementById('messages');
  const exitButton = document.getElementById('exitButton');
  const header = document.getElementById('header');
  const userList = document.getElementById('userList');

  let username;
  let room = 'default'; // Set the default room

  usernameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    username = document.getElementById('username').value;
    const room = 'default'; // You can add room selection logic here if needed
    usernameForm.style.display = 'none';
    messageForm.style.display = 'block';
    header.style.display = 'block';

    // Notify server that the user has joined the chat
    socket.emit('joinChat', { username, room });
  });

  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message.trim() !== '') {
      socket.emit('chatMessage', { username, message });
      displayMessage({ username, message, timestamp: new Date().toLocaleTimeString() });
      messageInput.value = '';
    }
  });

  exitButton.addEventListener('click', () => {
    usernameForm.style.display = 'block';
    messageForm.style.display = 'none';
    header.style.display = 'none';

     // Clear the input field
    document.getElementById('username').value = '';


    // Notify server that the user has exited the chat
    socket.emit('exitChat');

    // Request an updated user list from the server
    socket.emit('getRoomUserList');
  });
  
  socket.on('chatMessage', (data) => {
    if (data.type === 'join' || data.type === 'leave') {
      displayMessage({
        username: 'System',
        message: data.message,
        timestamp: new Date().toLocaleTimeString(),
      });
    } else {
      displayMessage(data);
    }
    // Update the user list when a chat message is received
    updateRoomUserList();
  });

  socket.on('userList', (users) => {
    updateUserList(users);
  });

  function updateUserList(users) {
    userList.innerHTML = '<strong>Users in the Room:</strong>';
    users.forEach((user) => {
      const userElement = document.createElement('div');
      userElement.textContent = user.username;
      userElement.classList.add('user-list-item');

      if (user.isActive) {
        userElement.classList.add('active-user');
      } else {
        userElement.classList.add('exited-user');
      }

      if (user.username === username) {
        userElement.classList.add('current-user');
      }

      userList.appendChild(userElement);
    });
  }

  function displayMessage(data) {
    const li = document.createElement('li');
    const timestamp = data.timestamp ? data.timestamp : new Date().toLocaleTimeString();
    li.innerHTML = `<strong>${data.username}</strong> (${timestamp}): ${data.message}`;
    messages.appendChild(li);
  }

  socket.on('systemMessage', (data) => {
    displaySystemMessage(data);
  });
  
  function displaySystemMessage(data) {
    const li = document.createElement('li');
    li.innerText = `${data.message} (${data.timestamp})`;
    messages.appendChild(li);
  }

  function updateRoomUserList() {
    // Request an updated user list from the server
    socket.emit('getRoomUserList', room);
  }
});