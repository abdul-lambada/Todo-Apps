const todos = [];
const RENDER_EVENT = 'render-todo';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addTodo();
    });

    // Membuat Fungsi AddTodo
    function addTodo() {
        const textTodo = document.getElementById('title').value;
        const timestamp = document.getElementById('date').value;

        const generateID = generateId();
        const todoObject = generateTodoObject(generateID, textTodo, timestamp, false);
        todos.push(todoObject);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    };

    // Membuat Fungsi struktur data GenerateId
    function generateId() {
        return +new Date();
    };

    function generateTodoObject(id, task, timestamp, isCompleted) {
        return {
            id,
            task,
            timestamp,
            isCompleted
        };
    };

    //membuat listener untuk melihat pada console dan menampilkan array todos
    // document.addEventListener(RENDER_EVENT, function(){
    //     console.log(todos);
    // });

    // Funsi MakeTodo
    //membuat fungsi render dri input container add ke container todo list
    function makeTodo(todoObject) {
        //untuk menampilkan tittle
        const textTitle = document.createElement('h2');
        textTitle.innerText = todoObject.task;

        //untuk menampilkan tanggal
        const textTimestamp = document.createElement('p');
        textTimestamp.innerText = todoObject.timestamp;

        //untuk menampilkan container 
        const textContainer = document.createElement('div');
        textContainer.classList.add('inner');
        textContainer.append(textTitle, textTimestamp);

        //untuk menampilkan style dari container
        const container = document.createElement('div');
        container.classList.add('item', 'shadow');
        container.append(textContainer);
        container.setAttribute('id', `todo-${todoObject.id}`);

        if (todoObject.isCompleted) {
            const undoButton = document.createElement('button');
            undoButton.classList.add('undo-button');

            undoButton.addEventListener('click', function () {
                undoTaskFormCompleted(todoObject.id);
            });

            const trashButton = document.createElement('button');
            trashButton.classList.add('trash-button');

            trashButton.addEventListener('click', function () {
                removeTaskFormCompleted(todoObject.id);
            });

            container.append(undoButton, trashButton);
        } else {
            const checkButton = document.createElement('button');
            checkButton.classList.add('check-button');

            checkButton.addEventListener('click', function () {
                addTaskCompleted(todoObject.id);
            });

            container.append(checkButton);
        };

        return container;
    };

    // Membuat fungsi perpindahan dari "yang harus dilakukan" ke "yang sudah dilakukan"

    function addTaskCompleted(todoId) {
        const todoTarget = findTodo(todoId);

        if (todoTarget == null) return;

        todoTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    };

    // Membuat fungsi findtodo
    function findTodo(todoId) {
        for (const todoItem of todos) {
            if (todoItem.id === todoId) {
                return todoItem;
            };
        };
        return null;
    };

    // Membuat Fngsi hapus (trash)
    function removeTaskFormCompleted(todoId){
        const todoTarget = findTodoIndex(todoId);

        if (todoTarget === -1) return;

        todos.splice(todoTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    };

    // Membuat Fungsi Undo
    function undoTaskFormCompleted(todoId){
        const todoTarget = findTodo(todoId);

        if(todoTarget == null)return;

        todoTarget.isCompleted = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    };

    // Membuat Fungsi untuk menghapus Index
    function findTodoIndex(todoId){
        for(const index in todos){
            if(todos[index].id === todoId){
                return index;
            }
        }
        return -1;
    }


    //membuat listener untuk render data dan menampilkan nya pada container todo list (web page)
    document.addEventListener(RENDER_EVENT, function () {
        // console.log(todos);
        const uncompletedTODOList = document.getElementById('todos');
        uncompletedTODOList.innerHTML = '';

        const completedTODOList = document.getElementById('completed-todos');
        completedTODOList.innerHTML = '';

        for (const todoItem of todos) {
            const todoElement = makeTodo(todoItem);
            if (!todoItem.isCompleted)
                uncompletedTODOList.append(todoElement);
            else
                completedTODOList.append(todoElement);
        };
    });
});