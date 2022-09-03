// 1. check on the form submit , whether the input is blank or not. if it is blank then show the modal, otherwise add to the task list
// 2. on pressing delete button,we need to remove the task.
// 3. we need to store and load all the tasks from application storage
let emptyInputModalInstance;
let deleteModalInstance;
const form = document.querySelector('#task-form');
const taskList = document.querySelector('#taskList');
const clearALlBtn = document.querySelector('#clearAll');
const taskInput = document.querySelector('#task');
const filterTask = document.querySelector('#filterTask');
const confirmValue = document.querySelector('#confirmValue');
loadEvents();
function loadEvents() {
  document.addEventListener('DOMContentLoaded', onload);
  form.addEventListener('submit', addTask);
  clearALlBtn.addEventListener('click', clearALlTasks);
  taskList.addEventListener('click', removeTask);
  filterTask.addEventListener('keyup', showFilteredTasks);
  confirmValue.addEventListener('click', confirmModal);
}
let deletedList;
let deletedTask;
// where ever is e i,e event function
function onload(e) {
  var elems = document.querySelector('#emptyInputModal');
  var del = document.querySelector('#deleteModal');
  emptyInputModalInstance = M.Modal.init(elems);
  deleteModalInstance = M.Modal.init(del);
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
function clearALlTasks(e) {
  e.preventDefault();
  let tasks = [];
  // slower method of removing  all child objects
  // taskList.innerHTML = '';  // for computation browser take more time
  // faster method of removing  all child objects
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }
}

function confirmModal(e) {
  deletedList.remove();
  removeFromLocalStorage(deletedTask);
  // console.log(deletedTask);
  deletedList = null;
  deletedTask = null;
  // modalPara.removeChild(p);
}

function removeTask(e) {
  if (isDeletedButton(e.target)) {
    deleteModalInstance.open();
    if (e.target.parentElement.nodeName === 'LI') {
      taskValue = e.target.parentElement.textContent;
      taskValue = taskValue.substring(0, taskValue.indexOf('delete'));
      deletedList = e.target.parentElement;
      deletedTask = taskValue;
      deleteValue.textContent = deletedTask + '?';
    } else {
      taskValue = e.target.parentElement.parentElement.textContent;
      taskValue = taskValue.substring(0, taskValue.indexOf('delete'));
      deletedList = e.target.parentElement.parentElement;
      deletedTask = taskValue;
      deleteValue.textContent = deletedTask + '?';
    }
  }
}
function showFilteredTasks(e) {
  const key = filterTask.value.toLowerCase();
  const lis = document.querySelectorAll('.collection-item');
  lis.forEach(function (li) {
    let liText = li.textContent;
    let index = liText.toLowerCase().substring(0, liText.lastIndexOf('delete')).indexOf(key);
    if (index < 0) {
      li.style.display = 'none';
    } else {
      li.style.display = 'block';
    }
  });
}
function isDeletedButton(el) {
  if (el.classList.contains('delete-task') || el.parentElement.classList.contains('delete-task')) {
    return true;
  }
  return false;
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
function removeFromLocalStorage(taskToBeDeleted) {
  let tasks = [];
  let storageTasks = localStorage.getItem('tasks');
  if (storageTasks === null) {
    alert('there is some sync issue with localStorage! please connect with admin');
  } else {
    tasks = JSON.parse(storageTasks);
    tasks = tasks.filter(function (task) {
      return task === taskToBeDeleted ? false : true;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}
