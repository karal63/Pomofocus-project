let timerModes = [
  {
    name: "Pomodoro",
    timeLook: "25:00",
    time: 1500,
    progress: 0.43,
    description: "Time to focus!",
    background: "rgb(77, 142, 77)",
    timesCompleted: 0,
  },
  {
    name: "Short Break",
    timeLook: "05:00",
    time: 300,
    progress: 2.17,
    description: "Time for a break!",
    background: "rgb(0, 98, 179)",
    timesCompleted: 0,
  },
  {
    name: "Long Break",
    timeLook: "15:00",
    time: 900,
    progress: 0.72,
    description: "Time for a break!",
    background: "rgb(0, 98, 179)",
    timesCompleted: 0,
  },
];

let currentMode = timerModes[0];

const descriptionBlock = document.querySelector(".desc-p");
const amountOfTimes = document.querySelector(".amount-of-times");

const modes = document.querySelectorAll(".mode");
modes.forEach((mode, i) => {
  mode.addEventListener("click", () => {
    clearActives();
    mode.classList.add("active-mode");
    currentMode = timerModes[i];
    optimazingTimer();
  });
});

function optimazingTimer() {
  clearInterval(timerInterval);

  timer = false;
  progress = 0;
  timerContainer.innerText = currentMode.timeLook;
  descriptionBlock.innerText = currentMode.description;
  totalSeconds = currentMode.time;
  progressStep = currentMode.progress;

  amountOfTimes.innerText = `#${currentMode.timesCompleted}`;

  startTimerBtn.textContent = "start";
  startTimerBtn.classList.remove("start-btn-clicked");
  nextBtn.style.display = "none";
  document.body.style.backgroundColor = currentMode.background;
  startTimerBtn.style.color = currentMode.background;
}

function clearActives() {
  modes.forEach((mode) => {
    mode.classList.remove("active-mode");
  });
}

const nextBtn = document.querySelector(".next-btn");
nextBtn.addEventListener("click", () => {
  if (currentMode === timerModes[0]) {
    currentMode = timerModes[1];
    clearActives();
    modes.forEach((mode, i) => {
      if (i === 1) {
        mode.classList.add("active-mode");
      }
    });

    optimazingTimer();
  } else {
    currentMode = timerModes[0];
    clearActives();
    modes.forEach((mode, i) => {
      if (i === 0) {
        mode.classList.add("active-mode");
      }
    });
    optimazingTimer();
  }
});

const timerContainer = document.querySelector(".timer");
const startTimerBtn = document.querySelector(".start-btn");
const progressLine = document.querySelector(".progress-line");

let totalSeconds = 1500;
let timer = false;
let timerInterval;
let progress = 0;
let progressStep = 0.43;

startTimerBtn.addEventListener("click", renderTimer);

function renderTimer() {
  timer = !timer;

  if (timer === true) {
    startTimerBtn.textContent = "pause";
    startTimerBtn.classList.add("start-btn-clicked");
    nextBtn.style.display = "block";

    timerInterval = setInterval(() => {
      if (totalSeconds > 0) {
        progress += progressStep;
        progressLine.style.width = `${progress}px`;
        formattingTimeLeft();
      } else {
        clearInterval(timerInterval);
        document.getElementById("sound").play();
        currentMode.timesCompleted++;
        timer = false;
        progress = 0;
        startTimerBtn.textContent = "start";
        optimazingTimer();
      }
    }, 1000);
  } else {
    startTimerBtn.classList.remove("start-btn-clicked");
    nextBtn.style.display = "none";
    startTimerBtn.textContent = "start";
    clearInterval(timerInterval);
  }
}

function formattingTimeLeft() {
  totalSeconds--;

  let minuts = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  let seconds = String(totalSeconds % 60).padStart(2, "0");

  let timeLeft = `${minuts}:${seconds}`;
  timerContainer.innerHTML = timeLeft;
  document.title = `${minuts}:${seconds} - Time to focus!`;
}

// tasks section

class taskConstructor {
  constructor(goal, quantity, completed) {
    this.goal = goal;
    this.quantity = quantity;
    this.completed = completed;
  }
}

const addTaskBtn = document.querySelector("#add-task-btn");
const createTaskMenu = document.querySelector(".create-task-menu");
const goalInput = document.querySelector(".goal-input");
const saveBtn = document.querySelector(".save-btn");
const cancelBtn = document.querySelector(".cancel-btn");
const tasksList = document.querySelector(".tasks-list");
const summary = document.querySelector(".summary");
const quantitySelector = document.querySelector(".counted-quantity");

let tasks = localStorage.getItem("tasks");

if (tasks) {
  tasks = JSON.parse(tasks);
  renderTasks();
} else {
  tasks = [];
}

addTaskBtn.addEventListener("click", createTask);
cancelBtn.addEventListener("click", closeTask);

function createTask() {
  addTaskBtn.style.display = "none";
  createTaskMenu.style.display = "block";
}

function closeTask() {
  addTaskBtn.style.display = "flex";
  createTaskMenu.style.display = "none";
}

function openSummary() {
  summary.style.display = "flex";
}

saveBtn.addEventListener("click", saveTask);

function saveTask() {
  let goal = goalInput.value;
  let quantity = quantityInput.value;
  let completed = false;

  if (goal === "" || isNaN(quantity)) {
    return;
  }
  tasks.push(new taskConstructor(goal, quantity, completed));

  goalInput.value = "";
  quantityInput.value = 1;

  saveToLocalStorage();
  renderTasks();
}

const plusBtn = document.querySelector(".plus-btn");
const minusBtn = document.querySelector(".minus-btn");
const quantityInput = document.querySelector(".quantity-input");

plusBtn.addEventListener("click", () => {
  let quantity = parseInt(quantityInput.value);
  if (quantity < 0) {
    quantity = 0;
  }
  quantity += 1;
  quantityInput.value = quantity;
});

minusBtn.addEventListener("click", () => {
  let quantity = parseInt(quantityInput.value);
  if (quantity <= 0) {
    quantity = 0;
    quantityInput.value = quantity;
    return;
  }
  quantity -= 1;
  quantityInput.value = quantity;
});

function editTask(index) {
  const taskElement = document.getElementById(`task-${index}`);
  const editableFormDiv = document.createElement("div");
  editableFormDiv.id = `edit-task-${index}`;
  editableFormDiv.innerHTML = editTaskMenu(tasks[index], index);

  taskElement.parentNode.replaceChild(editableFormDiv, taskElement);
}

function addEditQuantity(index) {
  const editQuantity = document.getElementById(`edit-quantity-${index}`);
  if (editQuantity.value > 0) {
    let task = tasks[index];
    let quantity = editQuantity.value;

    quantity++;
    task.quantity = quantity;
    editQuantity.value = quantity;
  }
  return;
}

function minusEditQuantity(index) {
  const editQuantity = document.getElementById(`edit-quantity-${index}`);
  if (editQuantity.value > 1) {
    let task = tasks[index];
    let quantity = editQuantity.value;

    quantity--;
    task.quantity = quantity;
    editQuantity.value = quantity;
  }
  return;
}

const editTaskMenu = (task, index) => {
  return `
  <div class="edit-task-menu">
          <div class="top-menu">
            <input
              type="text"
              class="goal-input"
              id="edit-goal-${index}"
              placeholder="What are you working on?"
              value="${task.goal}"
            />
            <div class="quantity">
              <p>Est Pomodoros</p>
              <div class="select-quantity">
                <input
                  value="${task.quantity}" 
                  class="quantity-input" type="text"
                  id="edit-quantity-${index}" 
                />
                <button class="plus-btn quantity-btn" onclick="addEditQuantity(${index})">
                  <i class="ri-arrow-up-s-fill"></i>
                </button>
                <button class="minus-btn quantity-btn" onclick="minusEditQuantity(${index})">
                  <i class="ri-arrow-down-s-fill"></i>
                </button>
              </div>
            </div>
            <div class="other-features">
              <button class="add-note">+ Add Note</button>
              <button class="add-project">+ Add Project</button>
            </div>
          </div>
          <div class="controls-edit">
            <div class="left-controls">
              <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
            </div>
            <div class="right-controls">
              <button class="cancel-btn" onclick="renderTasks()">Cancel</button>
              <button class="save-btn" onclick="saveEditedTask(${index})">Save</button>
            </div>
          </div>
        </div>
  `;
};

function deleteTask(index) {
  tasks.splice(index, 1);
  saveToLocalStorage();
  renderTasks();
}

function saveEditedTask(index) {
  const editGoalInput = document.getElementById(`edit-goal-${index}`);
  const editQuantity = document.getElementById(`edit-quantity-${index}`);
  let task = tasks[index];

  if (editQuantity.value > 0) {
    task.goal = editGoalInput.value;
    task.quantity = editQuantity.value;
  } else {
    return;
  }
  renderTasks();
}

function countFinishTime(countedQuantity) {
  const finishAt = document.querySelector(".time-finish");
  const hours = document.querySelector(".summary-time-hours");

  // Current date and time in seconds
  let currentDateSeconds = Math.floor(Date.now() / 1000);

  // Total additional seconds based on countedQuantity
  let finishTimeSeconds = countedQuantity * 25 * 60;
  let summarizedHours = ((countedQuantity * 25) / 60).toFixed(1);
  hours.innerHTML = `${summarizedHours}h`;

  // Future time in seconds
  let futureTimeSeconds = currentDateSeconds + finishTimeSeconds;

  // Create a new Date object for the future time
  let futureDate = new Date(futureTimeSeconds * 1000);

  // Format futureDate to a more readable format e.g., "April 5, 2024, 12:00:00"
  let formattedDate = futureDate.toLocaleString("en-US", {
    // year: "numeric",
    // month: "long",
    // day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
  });

  // Update HTML content with formatted date and time
  finishAt.innerHTML = formattedDate;
}

function renderTasks() {
  let countedQuantity = 0;
  if (tasks.length > 1) {
    openSummary();
    tasks.forEach((task) => {
      countedQuantity += parseInt(task.quantity);
    });
    quantitySelector.innerHTML = countedQuantity;
    countFinishTime(countedQuantity);
  }

  let tasksHTML = "";
  tasks.forEach((task, i) => {
    // Check if the task is completed and apply the necessary CSS classes
    const completedClass = task.completed ? "completed" : "";
    const goalCompletedClass = task.completed ? "completed-goal" : "";

    const taskHTML = `
      <div class="task" data-task-id="${i}" id="task-${i}">
        <div class="task-left">
          <button class="completed-icon" id="completed-${i}" onclick="completeTask(${i})">
            <i class="ri-checkbox-circle-fill ${completedClass}" id="completed-icon-${i}"></i>
          </button>
          <p class="task-title ${goalCompletedClass}" id="task-goal-${i}">${task.goal}</p>
        </div>
        <div class="task-right">
          <div class="score">
            <span class="x-completed">1</span><span>/</span>
            <span class="summary-puncts">${task.quantity}</span>
          </div>
          <button onclick="editTask(${i})" class="task-setting" id="task-setting-${i}">
            <i class="ri-more-2-line"></i>
          </button>
        </div>
      </div>
    `;
    tasksHTML += taskHTML;
  });
  saveToLocalStorage();

  tasksList.innerHTML = tasksHTML;
}

function completeTask(index) {
  const completedIcon = document.getElementById(`completed-icon-${index}`);
  const taskName = document.getElementById(`task-goal-${index}`);
  let task = tasks[index];

  if (task.completed === true) {
    task.completed = false;
    completedIcon.classList.remove("completed");
    taskName.classList.remove("completed-goal");
  } else {
    task.completed = true;
    completedIcon.classList.add("completed");
    taskName.classList.add("completed-goal");
    setTimeout(() => {
      let currentTask = tasks.splice(index, 1)[0];
      tasks.push(currentTask);
      renderTasks();
    }, 500);
  }

  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// let newPost = (post, postedAt = new Date()) => ({
//   ...post,
//   postedAt,
// });

// const firstPost = {
//   id: 1,
//   author: "leo",
// };

// const { id, author } = firstPost;
// console.log(id, author);
// console.table(newPost(firstPost));

const containerZoom = document.querySelector(".zoom-container");
const image = document.querySelector("img");

containerZoom.addEventListener("mousemove", (e) => {
  const x = e.clientX - e.target.offsetLeft;
  const y = e.clientY - e.target.offsetTop;

  image.style.transformOrigin = `${x}px ${y}px`;
  image.style.transform = "scale(2)";
});

containerZoom.addEventListener("mouseout", () => {
  image.style.transform = "scale(1)";
});

function moveElement(array, from, to) {
  // Remove the element from the array
  let element = array.splice(from, 1)[0];
  // Insert the element at the new position
  array.splice(to, 0, element);
}

let myArray = [1, 2, 3, 4, 5];
moveElement(myArray, 2, 4); // Move element at index 2 to index 4

// age

function User(age, birthday) {
  this.age = age;
  this.birthday = birthday;

  Object.defineProperty(this, "age", {
    get() {
      let todayYear = new Date().getFullYear();
      return todayYear - this.birthday.getFullYear() - 1;
    },
  });
}

const ageSelector = document.querySelector(".age-selector");
const dateSelector = document.querySelector(".date-selector");
const result = document.querySelector(".result");
const btn = document.querySelector(".submit");

btn.addEventListener("click", () => {
  let ageValue = ageSelector.value;
  let dateValue = dateSelector.value;
  let user = new User(ageValue, new Date(dateValue));
  result.innerHTML = `You are ${user.age} years old!`;
});
