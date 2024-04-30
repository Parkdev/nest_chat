const socket = io('/chatting');

// 해당 아이디를 가진 DOM 요소를 가져오는 함수
const getElementById = (id) => document.getElementById(id) || null;

//* get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form'); // 뷰에 인댁스에 chatform

//* global socket handler
socket.on('user_connected', (data) => {
  const { count, username } = data;
  const color = getUsernameColor(username);
  refreshUserCount(count);
  drawNewChat(`${username} connected`, '', color);
});

socket.on('new_chat', (data) => {
  const { chat, username } = data;
  const color = getUsernameColor(username);
  drawNewChat(`${username} : ${chat}`, '', color);
});

socket.on('user_disconnected', (username) => {
  const color = getUsernameColor(username);
  drawNewChat(`${username} disconnected`, '', color);
});

//* event callback functions
const handleSubmit = (event) => {
  event.preventDefault();
  const inputValue = event.target.elements[0].value;
  console.log(inputValue);
  if (inputValue !== '') {
    socket.emit('submit_chat', inputValue);
    //화면에 그리기

    drawNewChat(`me : ${inputValue}`, (isMe = true));
    event.target.elements[0].value = '';
  }
};

//* draw functions
const drawHelloStranger = (username) =>
  (helloStrangerElement.innerText = `Hello ${username} Stranger :)`);

const drawNewChat = (message, isMe = false, color = 'black') => {
  const wrapperChatBox = document.createElement('div');
  wrapperChatBox.className = 'clearfix';
  let chatBox;
  if (!isMe)
    chatBox = `
    <div
    class='bg-gray-300 w-3/4 mx-4 my-2 p-2 rounded-lg clearfix break-all'
    style='color: ${color}'
    >
      ${message}
    </div>
    `;
  else
    chatBox = `
    <div class='bg-white w-3/4 ml-auto mr-4 my-2 p-2 rounded-lg clearfix break-all '>
      ${message}
    </div>
    `;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

//* additional functions
const refreshUserCount = (count) => {
  const userCountElement = getElementById('user_count');
  userCountElement.innerText = `현재 ${count} 명 접속중`;
};

function getUsernameColor(username) {
  let hash = 7;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + (hash << 5) - hash;
  }

  let hue = 100 + (hash % 260);
  let saturation = 60 + (hash % 30); // 70-100%
  let lightness = 40 + (hash % 40); // 30-70%

  let color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  return color;
}

function helloUser() {
  const username = prompt('What is your name?');
  socket.emit('new_user', username, ({ username, count }) => {
    drawHelloStranger(username);
    refreshUserCount(count);
  });
}

function init() {
  helloUser(); // 접속했을때 확인창 뜨는 함수
  // 이벤트 연결
  formElement.addEventListener('submit', handleSubmit);
}

init();
