// 1. check on the form submit , whether the input is blank or not. if it is blank then show the modal, otherwise add to the task list
// 2. on pressing delete button,we need to remove the task.
// 3. we need to store and load all the tasks from application storage
let emptyInputModalInstance;
let deleteModalInstance;
let editModalInstance;
const form = document.querySelector('#task-form');
const taskList = document.querySelector('#taskList');
const clearALlBtn = document.querySelector('#clearAll');
const taskInput = document.querySelector('#task');
const filterTask = document.querySelector('#filterTask');
const confirmValue = document.querySelector('#confirmValue');
const deleteValue = document.querySelector('#deleteValue');
const editInput = document.querySelector('#editInput');
const saveValue = document.querySelector('#save');
loadEvents();
function loadEvents() {
  document.addEventListener('DOMContentLoaded', onload);
  form.addEventListener('submit', addTask);
  clearALlBtn.addEventListener('click', clearALlTasks);
  taskList.addEventListener('click', removeTask);
  taskList.addEventListener('click', editTask);
  filterTask.addEventListener('keyup', showFilteredTasks);
  confirmValue.addEventListener('click', confirmModal);
  saveValue.addEventListener('click', editModal);
}
let deletedList;
let deletedTask;
let taskValue = '';
let setInputValue = '';
let editValue = '';
// where ever is e i,e event function
function onload(e) {
  var empty = document.querySelector('#emptyInputModal');
  var del = document.querySelector('#deleteModal');
  var edit = document.querySelector('#editeModal');
  emptyInputModalInstance = M.Modal.init(empty);
  deleteModalInstance = M.Modal.init(del);
  editModalInstance = M.Modal.init(edit);
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
  deletedList = null;
  deletedTask = null;
}
function editModal(e) {
  location.reload();
  ref.textContent = editInput.value;
  const d = localStorage.getItem('tasks');
  const arrob = JSON.parse(d);
  for (i = 0; i < arrob.length; i++) {
    if (arrob[i] === editValue) {
      arrob[i] = editInput.value;
    }
  }
  localStorage.setItem('tasks', JSON.stringify(arrob));
}
function editTask(e) {
  if (isEditButton(e.target)) {
    editModalInstance.open();
    if (e.target.parentElement.nodeName === 'LI') {
      ref = e.target.parentElement;
      setInputValue = e.target.parentElement.textContent;
      setInputValue = setInputValue.substring(0, setInputValue.indexOf('delete'));
      editInput.value = setInputValue;
      editValue = setInputValue;
    } else {
      setInputValue = e.target.parentElement.parentElement.textContent;
      ref = e.target.parentElement.parentElement;
      setInputValue = setInputValue.substring(0, setInputValue.indexOf('delete'));
      editInput.value = setInputValue;
      editValue = setInputValue;
    }
  }
}
function isEditButton(el) {
  if (el.classList.contains('edit-task') || el.parentElement.classList.contains('edit-task')) {
    return true;
  }
  return false;
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
  const b = document.createElement('a');
  b.classList.add('secondary-content');
  b.classList.add('edit-task');
  b.href = '#';
  b.innerHTML = "<i class='material-icons'>create</i>";
  li.appendChild(b);
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
