const toggle = document.querySelector('.theme');
const icons = document.querySelectorAll('.theme img');
const form = document.querySelector('form');
const input = document.querySelector('form input');

const taskContainer = document.querySelector('.task-list');
const remain = document.getElementById('remain');

toggle.onclick = () => {
    document.body.classList.toggle('light');
    if (document.body.classList.contains('light')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
    icons.forEach(icon => {
        if (icon.classList.contains('hidden')) {
            icon.classList.remove('hidden');
        } else {
            icon.classList.add('hidden');
        }
    })
}

loadTasks(getTasks())

function loadTasks(tasks) {
    tasks.forEach(task => {
        const el = document.createElement('li');
        el.draggable = true;
        el.dataset.id = task.id;
        el.innerHTML = `
        <div class="left">
        <button aria-label="finish button" class="finish">
          <img src="images/icon-check.svg" alt="">
          <span class="circle"></span>
        </button>
        <p>${task.content}</p>
      </div>
      <button aria-label="remove button" class="remove">
        <img src="images/icon-cross.svg" alt="">
      </button>
        `
        if (task.finished) {
            el.querySelector('.left').classList.add('checked');
        }
        taskContainer.appendChild(el);
    })
}

form.onsubmit = e => {
    e.preventDefault()
    if (input.value) {
        const li = document.createElement('li');
        li.draggable = true;
        li.dataset.id = localStorage.getItem('id');
        localStorage.setItem('id', localStorage.getItem('id') + 1);
        li.innerHTML = `
        <div class="left">
        <button aria-label="finish button" class="finish">
          <img src="images/icon-check.svg" alt="">
          <span class="circle"></span>
        </button>
        <p>${input.value}</p>
      </div>
      <button aria-label="remove button" class="remove">
        <img src="images/icon-cross.svg" alt="">
      </button>
        `
        input.value = '';
        taskContainer.appendChild(li);

        let obj = new Object();
        obj.id = li.dataset.id;
        obj.content = li.querySelector('p').textContent;
        obj.finished = false;
        
        let arr = getTasks();
        arr.push(obj)
        updateLS(arr);
        updateCount(arr.length);
    }
}

function getTasks() {
    if(!localStorage.getItem('tasks')) {
        localStorage.setItem('tasks',JSON.stringify(
            [{
                id: 0,
                content: "Listen to Twice",
                finished: true
            },
            {
                id: 1,
                content: "Dance to Twice",
                finished: false
            },
            {
                id: 2,
                content: "Build todo app",
                finished: false
            }]
        ));

        localStorage.setItem('id', 3);

        localStorage.setItem('theme', 'dark');
    }
    return JSON.parse(localStorage.getItem('tasks'));
}

function updateLS(children) {
    localStorage.setItem('tasks', JSON.stringify(children));
}

function updateCount(count) {
    remain.innerHTML = count;
}

if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light')
}


// test
// document.querySelectorAll('.finish').forEach(btn => {
//     btn.onclick = (e) => {
//         e.target.closest('.left').classList.toggle('checked');
//     }
// })