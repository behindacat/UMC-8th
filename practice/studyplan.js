// script.js

const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');
const todoForm = document.getElementById('todo-form');

// 할 일이 제출될 때 실행될 함수
todoForm.addEventListener('submit', (event) => {
    event.preventDefault(); // 폼의 기본 제출 동작을 방지

    const todoText = todoInput.value.trim(); // 입력된 텍스트 가져오기

    if (todoText !== '') {
        addTodoItem(todoText);  // 할 일 추가
        todoInput.value = ''; // 입력 필드 초기화
        todoInput.focus(); // 입력 필드에 포커스 맞추기
    }
});

// 할 일 목록 항목 추가 함수
function addTodoItem(text) {
    const todoItem = document.createElement('li');
    todoItem.classList.add('render-container__item');

    const todoItemText = document.createElement('span');
    todoItemText.classList.add('render-container__item-text');
    todoItemText.textContent = text;

    const completeButton = document.createElement('button');
    completeButton.classList.add('render-container__item-button');
    completeButton.textContent = '완료';
    completeButton.addEventListener('click', () => markAsDone(todoItem));

    todoItem.appendChild(todoItemText);
    todoItem.appendChild(completeButton);
    todoList.appendChild(todoItem);
}

// 할 일을 해낸 일로 이동시키는 함수
function markAsDone(todoItem) {
    const doneItem = document.createElement('li');
    doneItem.classList.add('render-container__item');

    const doneItemText = document.createElement('span');
    doneItemText.classList.add('render-container__item-text');
    doneItemText.textContent = todoItem.firstChild.textContent;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('render-container__item-button');
    deleteButton.textContent = '삭제';
    deleteButton.addEventListener('click', () => deleteItem(doneItem));

    doneItem.appendChild(doneItemText);
    doneItem.appendChild(deleteButton);
    doneList.appendChild(doneItem);

    // 완료된 항목은 해야 할 일 목록에서 제거
    todoItem.remove();
}

// 해낸 일 항목 삭제 함수
function deleteItem(doneItem) {
    doneItem.remove(); // 삭제된 항목을 해낸 일 목록에서 제거
}
