const taskKey = '@tasks';


function addTask(event) {
  event.preventDefault(); 
  const taskId = new Date().getTime();
  const taskList = document.querySelector('#taskList');

  const form = document.querySelector('#taskForm');
  const formData = new FormData(form);

  const taskTitle = formData.get('title');
  const taskDescription = formData.get('description');

  const li = document.createElement('li');
  li.id = taskId;
  li.innerHTML = `
      <h2>${taskTitle}</h2>
      <p>${taskDescription}</p>
      <button class="edit-btn" title="Editar tarefa" onclick="openEditDialog(${taskId})">✏️</button>
      <button class="delete-btn" title="Excluir tarefa" onclick="removeTask(${taskId})">❌</button>
  `;

  taskList.appendChild(li);


  const tasks = JSON.parse(localStorage.getItem(taskKey)) || [];
  tasks.push({ id: taskId, title: taskTitle, description: taskDescription });
  localStorage.setItem(taskKey, JSON.stringify(tasks));

  form.reset();
}


window.addEventListener('DOMContentLoaded', () => {
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || [];
  const taskList = document.querySelector('#taskList');
  taskList.innerHTML = tasks
    .map((task) => `
      <li id="${task.id}">
        <h2>${task.title}</h2>
        <p>${task.description}</p>
        <button class="edit-btn" title="Editar tarefa" onclick="openEditDialog(${task.id})">✏️</button>
        <button class="delete-btn" title="Excluir tarefa" onclick="removeTask(${task.id})">❌</button>
      </li>
    `)
    .join('');
});

function openEditDialog(taskId) {
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || [];
  const task = tasks.find(task => task.id === taskId);

  if (task) {
    document.querySelector('#editTaskId').value = task.id;
    document.querySelector('#editTitle').value = task.title;
    document.querySelector('#editDescription').value = task.description;

    document.querySelector('#editTaskDialog').showModal();
  }
}

function closeEditDialog() {
  document.querySelector('#editTaskDialog').close();
}

function saveEdit(event) {
  event.preventDefault();
  const taskId = document.querySelector('#editTaskId').value;
  const taskTitle = document.querySelector('#editTitle').value;
  const taskDescription = document.querySelector('#editDescription').value;

  const tasks = JSON.parse(localStorage.getItem(taskKey)) || [];
  const taskIndex = tasks.findIndex(task => task.id == taskId);

  if (taskIndex > -1) {
    tasks[taskIndex].title = taskTitle;
    tasks[taskIndex].description = taskDescription;
    localStorage.setItem(taskKey, JSON.stringify(tasks));

    const li = document.getElementById(taskId);
    li.querySelector('h2').innerText = taskTitle;
    li.querySelector('p').innerText = taskDescription;

    closeEditDialog();
  }
}

function removeTask(taskId) {
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || [];
  const updatedTasks = tasks.filter(task => task.id !== taskId);
  localStorage.setItem(taskKey, JSON.stringify(updatedTasks));

  const li = document.getElementById(taskId);
  if (li) {
    li.remove();
  }
}
