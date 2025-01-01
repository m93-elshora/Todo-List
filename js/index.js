const formElment = document.querySelector("form");
const inputElment = document.querySelector("input");
const apiKey = "676cdcb860a208ee1fdecb76";
let allTodos = [];
const loadingScreen = document.querySelector(".loading");
getAllTodos();

formElment.addEventListener("submit", (e) => {
  e.preventDefault();
  // addTodos();

  if (inputElment.value.trim().length > 0) {
    addTodos();
  }
});

async function addTodos() {
  showLoading();

  const todo = {
    title: inputElment.value,
    apiKey: apiKey,
  };

  const obj = {
    method: "post",
    body: JSON.stringify(todo),
    headers: {
      "content-type": "application/json",
    },
  };
  const response = await fetch("https://todos.routemisr.com/api/v1/todos", obj);

  if (response.ok) {
    const data = await response.json();

    if (data.message === "success") {
      toastr.success("Added Successfully", "Toastr App");
      await getAllTodos();

      formElment.reset();
      hideLoading();
    }
    // else { // }
  }
  hideLoading();
}

async function getAllTodos() {
  showLoading();

  const response = await fetch(
    `https://todos.routemisr.com/api/v1/todos/${apiKey}`
  );

  if (response.ok) {
    const data = await response.json();

    if (data.message === "success") {
      allTodos = data.todos;
      displayData();
      console.log(allTodos);
    }
  }
  hideLoading();
}

function displayData() {
  let cartona = "";

  for (const todo of allTodos) {
    cartona += `
      <li class="d-flex align-items-center justify-content-between border-bottom pb-2 my-2">
          <span style=" ${
            todo.completed ? "text-decoration:line-through" : ""
          }"  onclick="markCompleted('${todo._id}')" class="task-name"> ${
      todo.title
    } </span>
          <div class="d-flex align-items-center gap-4">
            ${
              todo.completed
                ? '<span><i class="fa-solid fa-check" style="color: #63e6be"></i></span> '
                : ""
            } 
            <span onclick="deleteTodo('${
              todo._id
            }')" class="icon"> <i class="fa-solid fa-trash"></i></span>
          </div>
      </li>

    `;
  }

  document.querySelector(".task-container").innerHTML = cartona;

  changeProgress();
}

async function deleteTodo(idTodo) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      showLoading();

      const todoData = {
        todoId: idTodo,
      };
      const obj = {
        method: "DELETE",
        body: JSON.stringify(todoData),
        headers: {
          "content-type": "application/JSON",
        },
      };
      const response = await fetch(
        "https://todos.routemisr.com/api/v1/todos",
        obj
      );
      if (response.ok) {
        const data = await response.json();
        if (data.message === "success") {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });

          await getAllTodos();
          console.log("Done");
        }
      }

      hideLoading();
    }
  });
}

async function markCompleted(idTodo) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Compelet it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const todoData = {
        todoId: idTodo,
      };
      const obj = {
        method: "PUT",
        body: JSON.stringify(todoData),
        headers: {
          "content-type": "application/JSON",
        },
      };
      const response = await fetch(
        "https://todos.routemisr.com/api/v1/todos",
        obj
      );
      if (response.ok) {
        const data = await response.json();
        if (data.message === "success") {
          getAllTodos();
        }
      }

      Swal.fire({
        title: "compelet!",
        icon: "success",
      });
    }
  });
}

function showLoading() {
  loadingScreen.classList.remove("d-none");
}

function hideLoading() {
  loadingScreen.classList.add("d-none");
}

function changeProgress() {
  const compeletedTaskNumber = allTodos.filter((todo) => todo.completed).length;
  const totalTask = allTodos.length;

  document.getElementById("progress").style.width = `${
    (compeletedTaskNumber / totalTask) * 100
  }%`;

  const statusNumber = document.querySelectorAll(".status-number span");

  statusNumber[0].innerHTML = compeletedTaskNumber;
  statusNumber[1].innerHTML = totalTask;
}
