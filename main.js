// 1. check on the form submit , whether the input is blank or not. if it is blank then show the modal, otherwise add to the task list
// 2. on pressing delete button,we need to remove the task.
// 3. we need to store and load all the tasks from application storage
let emptyInputModalInstance;
const form = document.querySelector('#task-form');
const taskList = document.querySelector('#taskList');
const clearALlBtn = document.querySelector('#clearAll');
const taskInput = document.querySelector('#task');
const filterTask = document.querySelector('#filterTask');
loadEvents();
function loadEvents() {
  document.addEventListener('DOMContentLoaded', onload);
  form.addEventListener('submit', addTask);
  clearALlBtn.addEventListener('click', clearALlTasks);
}
function onload(e) {
  var elems = document.querySelector('#emptyInputModal');
  emptyInputModalInstance = M.Modal.init(elems);
  loadItemsFormStorage();
}
function addTask(e) {
  e.preventDefault();
  const input = taskInput.value;
  if (input === '') {
    emptyInputModalInstance.open();
    return;
  }
  // add to list
  addTaskElement(input);
  // add to local storage
  addToLocalStorage(input);
  // make input blank
  taskInput.value = '';
}
function loadItemsFormStorage() {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  if (tasks !== null) {
    tasks.forEach(function (task) {
      addTaskElement(task);
    });
  }
}
function addTaskElement(task) {
  // create a LI
  const li = document.createElement('LI');
  li.className = 'collection-item';
  li.appendChild(document.createTextNode(task));
  // create anchor tag
  const a = document.createElement('a');
  a.classList.add('secondary-content');
  a.classList.add('delete-task');
  a.href = '#';
  a.innerHTML = "<i class='material-icons'>delete</i>";
  li.appendChild(a);
  taskList.appendChild(li);
}
function addToLocalStorage(task) {
  let tasks;
  let storageTasks = localStorage.getItem('tasks');
  if (storageTasks === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(storageTasks);
  }
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
function clearALlTasks(e) {
  e.preventDefault();
  let tasks = [];
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }
}
