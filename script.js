const toggle = document.querySelector('.theme');
const icons = document.querySelectorAll('.theme img');
const form = document.querySelector('form');
const input = document.querySelector('form input');

const taskContainer = document.querySelector('.task-list');
const remain = document.getElementById('remain');

const buttons = document.querySelectorAll('.buttons button');
const all = document.getElementById('all');
const active = document.getElementById('active');
const complete = document.getElementById('complete');

const clearAll = document.getElementById('clear');

const dark = document.querySelector('.header-bg img:first-child');
const light = document.querySelector('.header-bg img:last-child');

toggle.onclick = () => {
    document.body.classList.toggle('light');
    if (document.body.classList.contains('light')) {
        localStorage.setItem('theme', 'light');
        light.style.opacity = 1;
        dark.style.opacity = 0;
    } else {
        localStorage.setItem('theme', 'dark');
        dark.style.opacity = 1;
        light.style.opacity = 0;
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
    taskContainer.innerHTML = '';
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

        if (all.classList.contains('active')) {
            taskContainer.appendChild(el);
        } else if (active.classList.contains('active') && !el.querySelector('.left').classList.contains('checked')) {
            taskContainer.appendChild(el);
        } else if (complete.classList.contains('active') && el.querySelector('.left').classList.contains('checked')) {
            taskContainer.appendChild(el);
        }

    });

    updateCount(Array.from(taskContainer.children));

    document.querySelectorAll('.finish').forEach(btn => {
        btn.onclick = (e) => {
            e.target.closest('.left').classList.toggle('checked');
            if (complete.classList.contains('active') || active.classList.contains('active')) {
                e.target.closest('li').remove();
            }
            const tasks = getTasks();
            for (obj of tasks) {
                if (obj.id == e.target.closest('li').dataset.id) {
                    if (obj.finished) {
                        obj.finished = false;
                    } else {
                        obj.finished = true;
                    }
                }
            }
            updateLS(tasks)
            updateCount(Array.from(taskContainer.children));
        }
    });

    const elements = taskContainer.querySelectorAll('li');
    elements.forEach(el => {
        el.addEventListener('dragstart', e => {
            e.target.classList.add('dragging');
        });
        el.addEventListener('dragend', e => {
            if (all.classList.contains('active')) {
                const tasks = taskContainer.querySelectorAll('li');
                let arr = [];
                tasks.forEach(task => {
                    let obj = new Object();
                    obj.id = task.dataset.id;
                    obj.content = task.querySelector('p').textContent;
                    obj.finished = (task.querySelector('.left').classList.contains('checked') ? true : false);
                    arr.push(obj);
                })
                updateLS(arr);
            }
            e.target.classList.remove('dragging');
        })
    })
    taskContainer.addEventListener('dragover', e => {
        e.preventDefault();
        const after = getDragAfter(taskContainer, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (draggable) {
            taskContainer.insertBefore(draggable, after.element);
        } else {
            taskContainer.appendChild(draggable);
        }
    })

    const closeBtns = taskContainer.querySelectorAll('.remove');
    closeBtns.forEach(btn => {
        btn.onclick = () => {
            btn.closest('li').classList.add('delete');
            btn.closest('li').onanimationend = e => {
                e.target.remove();
                updateCount(Array.from(taskContainer.children));
            }
            const id = btn.closest('li').dataset.id;
            const remaining = getTasks().filter(el => {
                return el.id != id;
            });
            updateLS(remaining);

        }
    });
}

function getDragAfter(container, y) {
    const elements = [... container.querySelectorAll('li:not(.dragging)')];

    return elements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    },{ offset: Number.NEGATIVE_INFINITY })
}

form.onsubmit = e => {
    e.preventDefault()
    if (input.value) {
        const li = document.createElement('li');
        li.draggable = true;
        li.dataset.id = localStorage.getItem('id');
        localStorage.setItem('id', parseInt(localStorage.getItem('id')) + 1);
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

        let obj = new Object();
        obj.id = li.dataset.id;
        obj.content = li.querySelector('p').textContent;
        obj.finished = false;
        
        let arr = getTasks();
        arr.push(obj)
        updateLS(arr);
        updateCount(Array.from(taskContainer.children));
        loadTasks(arr);
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
                content: "Build todo app",
                finished: true
            },
            {
                id: 2,
                content: "Dance to Twice",
                finished: false
            },
            {
                id: 3,
                content: "Finish JavaScript course",
                finished: false
            },
            {
                id: 4,
                content: "Finish homework",
                finished: false
            },
            {
                id: 5,
                content: "Netflix and chill",
                finished: false
            }]
        ));

        localStorage.setItem('id', 6);

        localStorage.setItem('theme', 'dark');
    }
    return JSON.parse(localStorage.getItem('tasks'));
}

function updateLS(children) {
    localStorage.setItem('tasks', JSON.stringify(children));
}

function updateCount(array) {
    let count = 0;
    for (item of array) {
        if (!item.querySelector('.left').classList.contains('checked')) {
            count++;
        }
    }
    remain.textContent = `${count} items left`;
}

if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
} else {
    light.style.opacity = '0';
}

buttons.forEach(button => {
    button.onclick = () => {
        buttons.forEach(btn => { btn.classList.remove('active') });
        button.classList.add('active');
        loadTasks(getTasks());
    }
})

clearAll.onclick = () => {
    const remaining = getTasks().filter(el => {
        return !el.finished;
    });
    const tasks = taskContainer.querySelectorAll('li');
    tasks.forEach(task => {
        if (task.querySelector('.left').classList.contains('checked')) {
            task.classList.add('delete');
        }
        task.onanimationend = e => {
            e.target.remove();
        }
    })
    updateLS(remaining);
}

function moveNav() {
    const nav = document.querySelector('.buttons');
    const bottom = document.querySelector('nav');
    if (document.body.clientWidth >= 700) {
        document.querySelector('.state').insertBefore(nav, clearAll);
        bottom.style.display = 'none';
    } else {
        bottom.style.display = 'block';
        bottom.appendChild(nav);
    }
}

function changeBg() {
    if (document.body.clientWidth >= 700) {
        light.setAttribute('src', "images/bg-desktop-light.jpg");
        dark.setAttribute('src', "images/bg-desktop-dark.jpg");
    } else {
        light.setAttribute('src', "images/bg-mobile-light.jpg");
        dark.setAttribute('src', "images/bg-mobile-dark.jpg");
    }
}

window.onresize = () => {
    changeBg();
    moveNav();
};
changeBg();
moveNav();