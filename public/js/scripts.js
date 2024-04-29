const socket = io('/chatting');

// 해당 아이디를 가진 DOM 요소를 가져오는 함수
const getElementById = (id) => document.getElementById(id) || null;

//* get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form'); // 뷰에 인댁스에 chatform

//* global socket handler
socket.on('user_connected', (username) => {
  drawNewChat(`${username} connected`);
});

socket.on('new_chat', (data) => {
  const { chat, username } = data;
  drawNewChat(`${username} : ${chat}`);
});

//* event callback functions
const handleSubmit = (event) => {
  event.preventDefault();
  const inputValue = event.target.elements[0].value;
  console.log(inputValue);
  if (inputValue !== '') {
    socket.emit('send_message', inputValue);
    //화면에 그리기

    drawNewChat(`me : ${inputValue}`);
    event.target.elements[0].value = '';
  }
};

//* draw functions
const drawHelloStranger = (username) => {
  return (helloStrangerElement.innerText = `Hello ${username} Stranger :)`);
};

const drawNewChat = (message) => {
  const wrapperChatBox = document.createElement('div');
  const chatBox = `
  <div>
  ${message}
  </div>
  `;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.appendChild(wrapperChatBox);
};

function helloUser() {
  const username = prompt('What is your name?');
  socket.emit('new_user', username, (data) => {
    drawHelloStranger(data);
  });
}

function init() {
  helloUser(); // 접속했을때 확인창 뜨는 함수
  // 이벤트 연결
  formElement.addEventListener('submit', handleSubmit);
}

init();
