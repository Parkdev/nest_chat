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
  refreshUserCount(count);
  drawNewChat(`${username} connected`);
});

socket.on('new_chat', (data) => {
  const { chat, username } = data;
  drawNewChat(`${username} : ${chat}`);
});

socket.on('user_disconnected', (username) => {
  drawNewChat(`${username} disconnected`);
});

//* event callback functions
const handleSubmit = (event) => {
  event.preventDefault();
  const inputValue = event.target.elements[0].value;
  console.log(inputValue);
  if (inputValue !== '') {
    socket.emit('submit_chat', inputValue);
    //화면에 그리기

    drawNewChat(`me : ${inputValue}`);
    event.target.elements[0].value = '';
  }
};

//* draw functions
const drawHelloStranger = (username) =>
  (helloStrangerElement.innerText = `Hello ${username} Stranger :)`);

const drawNewChat = (message, isMe = false) => {
  const wrapperChatBox = document.createElement('div');
  wrapperChatBox.className = 'clearfix';
  let chatBox;
  if (!isMe)
    chatBox = `
    <div class='bg-gray-300 w-3/4 mx-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
    `;
  else
    chatBox = `
    <div class='bg-white w-3/4 ml-auto mr-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
    `;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

const refreshUserCount = (count) => {
  const userCountElement = getElementById('user_count');
  userCountElement.innerText = `현재 ${count} 접속중`;
};

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
