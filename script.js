document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    function addTask(text) {
        const li = document.createElement('li');
        li.className = 'task';
        li.draggable = true;

        li.innerHTML = `
            <span>${text}</span>
            <button class="deleteBtn">Delete</button>
        `;

        li.querySelector('.deleteBtn').addEventListener('click', () => {
            taskList.removeChild(li);
        });

        li.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', null);
            li.classList.add('dragging');
        });

        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
        });

        taskList.appendChild(li);
    }

    taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        const afterElement = getDragAfterElement(taskList, e.clientY);
        if (afterElement == null) {
            taskList.appendChild(draggingItem);
        } else {
            taskList.insertBefore(draggingItem, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});
