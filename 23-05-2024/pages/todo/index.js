const taskKey = '@tasks'
let currentTasks = [];

// Função para adicionar tarefa
function addTask(event) {
  event.preventDefault() // Evita o recarregamento da página
  const taskId = new Date().getTime()
  const taskList = document.querySelector('#taskList')

  const form = document.querySelector('#taskForm')
  const formData = new FormData(form)

  const taskTitle = formData.get('title')
  const taskDescription = formData.get('description');

  const li = createTaskItemElement(taskId, taskTitle, taskDescription); 

  taskList.appendChild(li)

  // Salvar tarefas no localStorage
  currentTasks = JSON.parse(localStorage.getItem(taskKey)) || [];
  const newTask = { id: taskId, title: taskTitle, description: taskDescription };
  currentTasks.push(newTask);
  localStorage.setItem(taskKey, JSON.stringify(currentTasks))

  form.reset()
}

// Carregar tarefas do localStorage ao recarregar a página
window.addEventListener('DOMContentLoaded', () => {
  currentTasks = JSON.parse(localStorage.getItem(taskKey)) || []
  const taskList = document.querySelector('#taskList')
  currentTasks.forEach((task) => {
    taskList.appendChild(createTaskItemElement(task.id, task.title, task.description));
  });
})

function createTaskItemElement(id, title, description) {
  const listItem = document.createElement("li");
  const heading = document.createElement("h2");
  const paragraph = document.createElement("p");
  const button = createTaskItemButton();
  heading.textContent = title;
  paragraph.textContent = description;
  listItem.appendChild(heading);
  listItem.appendChild(paragraph);
  listItem.appendChild(button);
  listItem.classList.add("todo-item");
  listItem.id = id;
  return listItem;
}

function createTaskItemButton() {
  const button = document.createElement("button");
  button.textContent = "✏️";
  button.title = "Editar tarefa";

  button.addEventListener("click", (e) => {
    const dialog = document.querySelector("#dialog-task-edit")
    const taskId = e.target.parentElement.id;
    const task = currentTasks.find(task => task.id == taskId);
    setDialogInputsValue(dialog, task);
    dialog.setAttribute("open", true);
  })
  return button;
}

function setDialogInputsValue(dialog, task) {
  const titleInput = dialog.querySelector("#input-title");
  const descriptionInput = dialog.querySelector("#input-description");
  titleInput.value = task.title;
  descriptionInput.value = task.description;
}

function closeDialog(event) {
  event.preventDefault();
  const dialog = document.querySelector("#dialog-task-edit");
  dialog.removeAttribute("open");
}