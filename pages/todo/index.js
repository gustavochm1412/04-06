const taskKey = '@tasks'

let selectedTaskId = null

// Função para adicionar tarefa
function addTask(event) {
  event.preventDefault() // Evita o recarregamento da página
  const taskId = new Date().getTime()
  const taskList = document.querySelector('#taskList')

  const form = document.querySelector('#taskForm')
  const formData = new FormData(form)

  const taskTitle = formData.get('title')
  const taskDescription = formData.get('description')

  const li = document.createElement('li')

  li.id = `id-${taskId}`
  li.innerHTML = `
    <div>
      <h2>${taskTitle}</h2>
      <p>${taskDescription}</p>
    </div>
    <div class="task-actions">
      <button title="Editar tarefa" onClick="openEditDialog(${taskId})">✏️</button>
      <button title="Excluir tarefa" onClick="removeTask(${taskId})">❌</button>
    </div>
  `

  taskList.appendChild(li)

  // Salvar tarefas no localStorage
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || []
  tasks.push({
    id: taskId,
    title: taskTitle,
    description: taskDescription,
  })
  localStorage.setItem(taskKey, JSON.stringify(tasks))

  form.reset()
}

function openEditDialog(taskId) {
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || []

  selectedTaskId = tasks.findIndex((task) => task.id === taskId)
  const task = tasks[selectedTaskId]

  const dialog = document.querySelector('dialog')

  const editTitle = document.querySelector('#editTaskForm #title')
  const editDescription = document.querySelector('#editTaskForm #description')
  
  editTitle.value = task.title
  editDescription.value = task.description
  
  dialog.showModal()
}

function closeDialog() {
  const dialog = document.querySelector('dialog')
  dialog.close()
}

function editTask(event) {
  const form = document.querySelector('#editTaskForm');
  const formData = new FormData(form);

  const tasks = JSON.parse(localStorage.getItem(taskKey)) || [];
  const outdatedTask = tasks[selectedTaskId]

  outdatedTask.title = formData.get("title");
  outdatedTask.description = formData.get("description");

  localStorage.setItem(taskKey, JSON.stringify(tasks));
}

function removeTask(taskId) {
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || [];
  const selectedTask = tasks.findIndex((task) => task.id === taskId);
  
  if (selectedTask != -1) {
    tasks.splice(selectedTask, 1);
    localStorage.setItem(taskKey, JSON.stringify(tasks));

    const taskListElement = document.querySelector("#taskList");
    const taskElement = document.querySelector(`#id-${taskId}`);
    taskListElement.removeChild(taskElement);
  }
}

// Carregar tarefas do localStorage ao recarregar a página
window.addEventListener('DOMContentLoaded', () => {
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || []
  const taskList = document.querySelector('#taskList')

  taskList.innerHTML = tasks
    .map(
      (task) => `
      <li id='id-${task.id}'>
        <div>
          <h2>${task.title}</h2>
          <p>${task.description}</p>
        </div>
        <div class="task-actions">
          <button title="Editar tarefa" onClick="openEditDialog(${task.id})">✏️</button>
          <button title="Excluir tarefa" onClick="removeTask(${task.id})">❌</button>
        </div>
      </li>
    `
    )
    .join('')
})
