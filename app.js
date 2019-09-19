var state = {
  todo: [],
  inprogress: [],
  done: [],
  addItemToState: function(key, item) {
    this[key].push(item);
  },
  deleteItemFromState: function(key, item) {
    console.log(item)
    this[key] = this[key].filter(element => element.id != item.id);
  },
};


var newElement = {
  id: 0,
  addToDo: function (){
    var inp = document.getElementById("new-todo");
    var title = inp.value;
    newElement.id++;
    var key = 'todo';
    var keyId = key + newElement.id;
    state.addItemToState(key, { title: title, id: newElement.id });
    locStorage.addToLocalStorage(keyId, { title: title, id: newElement.id });
    createTodo(key, title, newElement.id);
    localStorage.setItem('id', newElement.id)
    },
  loadToDo: function(obj){
    for(var i = 1; i <= 10; i++){
      newElement.id++;
      locStorage.addToLocalStorage('todo' + newElement.id, {title: obj[i].title, id: newElement.id});
      state.addItemToState('todo', { title: obj[i].title, id: newElement.id});
      localStorage.setItem('id', newElement.id);
    }
    location.reload();
  }
  };

function createTodo(idPanel, title, divId){
    var div = document.createElement("div");
    var b = document.createElement("b");
    var todoList = document.getElementById(idPanel);
    var buttonDelete = document.createElement("button");
    var buttRight = document.createElement("button");
      

    todoList.appendChild(div);
    div.setAttribute("id", divId);
    div.setAttribute("class", "todo");
    div.appendChild(b);
    div.appendChild(buttonDelete);
    b.innerHTML = title;
    b.id = 'b' + divId;
    buttonDelete.id = "button-Delete";
    buttonDelete.innerHTML = "&#10008;";
    buttonDelete.addEventListener('click', deleteToDo);
    buttonDelete.addEventListener('click', deleteElement);
    function deleteElement(e){
      var parent = e.target.parentElement;
      parent.remove();
    };
    function deleteElement2(e){
      var parent = e.target.parentElement.parentElement;
      parent.remove();
    };
    div.appendChild(buttRight);
    buttRight.id = "button-right-move";
    buttRight.innerHTML = "<strong>&rArr;</strong>";
    buttRight.addEventListener("click", moveToInprogressPanel);
    buttRight.addEventListener('click', deleteElement2);
    var inp = document.getElementById("new-todo");
    inp.value = "";
  }
var locStorage = {
checkLocStorage: function(){
    var getId = localStorage.getItem('id');
    newElement.id = getId;
    for (var i = 1; i <= newElement.id; i++) {
    var key1 = "todo" + i;
    var item1 = localStorage.getItem(key1);
    var key2 = "inprogress" + i;
    var item2 = localStorage.getItem(key2);
    var key3 = "done" + i;
    var item3 = localStorage.getItem(key3);
    if (item1 != null) {
      var el1 = JSON.parse(item1);
      createTodo("todo", el1.title, i);
      state.addItemToState('todo', {title: el1.title, id: el1.id});
      localStorage.setItem('id', newElement.id);
    } else {
        if (item2 != null) {
          var el2 = JSON.parse(item2);
          createTodo("inprogress", el2.title, i);
          state.addItemToState('inprogress', {title: el2.title, id: el2.id});
          localStorage.setItem('id', newElement.id);
        } else {
            if (item3 != null) {
              var el3 = JSON.parse(item3);
              createTodo("done", el3.title, i);
              state.addItemToState('done', {title: el3.title, id: el3.id});
              localStorage.setItem('id', newElement.id)
            } else{
              continue;
            }
          }
        }
      }
    },
addToLocalStorage: function(state, todo){
  var todo = JSON.stringify(todo);
  localStorage.setItem(state, todo);
  },
clearLocStorage: function(){
  localStorage.clear();
  location.reload();
}
}

document.addEventListener('DOMContentLoaded', locStorage.checkLocStorage );

var butt = document.getElementById("add-todo");
butt.addEventListener("click", newElement.addToDo);
var load = document.getElementById('load');
load.addEventListener("click", makeRequest);
var clear = document.getElementById("clear");
clear.addEventListener('click', locStorage.clearLocStorage);

function makeRequest() {
  var url = 'https://jsonplaceholder.typicode.com/todos';
  var method = 'GET';
  var params = null;
  var httpRequest = false;

   if (window.XMLHttpRequest) { // Mozilla, Safari, ...
      httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE
      try {
          httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
          try {
              httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (e) { }
      }
  }

   if (!httpRequest) {
      alert('Не вышло :( Невозможно создать экземпляр класса XMLHTTP ');
      return false;
  }

  httpRequest.onreadystatechange = function () { doSomethingWithContent(httpRequest); };
  httpRequest.open(method, url, true);
  httpRequest.send(params);
}

function doSomethingWithContent(httpRequest) {
  if (httpRequest.readyState == 4) {
      if (httpRequest.status == 200) {
          var obj = JSON.parse(httpRequest.responseText);
          newElement.loadToDo(obj);
       } else if (httpRequest.status == 404) {
          console.log("Ресурс не найден.");
      }
      else {
          console.error('Unknown error.');
      }
  }
}




function deleteToDo(event){
  var id = event.target.parentElement.id;
  var key = event.target.parentElement.parentElement.id;
  var b = document.getElementById('b' + id);
  var title = b.textContent;
  state.deleteItemFromState(key, {title:title, id:id});
  localStorage.removeItem(key + id);
}

function moveToInprogressPanel(event){
  var id = event.target.parentElement.parentElement.id;
  var key = event.target.parentElement.parentElement.parentElement.id;
  var b = document.getElementById('b' + id);
  console.log(key);
  var title = b.textContent;
  state.deleteItemFromState(key, {title:title, id:id});
  localStorage.removeItem(key + id);
  if (key === "todo"){
    createTodo('inprogress', title, id);
    locStorage.addToLocalStorage('inprogress' + id, {title: title, id: id});
    state.addItemToState('inprogress', {title: title, id: id});
  } else{
    if(key === "inprogress"){
      createTodo('done', title, id);
      locStorage.addToLocalStorage('done' + id, {title: title, id: id});
      state.addItemToState('done', {title: title, id: id});
    }
  }


}