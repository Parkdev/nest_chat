// 해당 아이디를 가진 DOM 요소를 가져오는 함수
const getElementById = (id) => document.getElementById(id) || null;

//* get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElemnt = getElementById('chat_form');

function helloUser() {
  const username = prompt('What is your name?');
}

function init() {
  helloUser(); // 접속했을때 확인창 뜨는 함수
}

init();
