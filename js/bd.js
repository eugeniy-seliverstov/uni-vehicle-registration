let globalNumber = 1;
let url = "http://127.0.0.1:3012";

const viewError = error => {
  console.error(error);
}

/* Удалить автомобиль из базы данных */
const deleteAuto = async (id) => {
  const url1 = `${url}/cars/remove/${id}`;
  const settings = {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }
  try {
    const response = await fetch(url1,settings);
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Ошибка HTTP: " + response.status);
    }
  } catch (e) {
    console.log("Ошибка удаления автомобиля из базы данных!");
  }
}
const deleteAutoResp = respond => {
  if (respond) {
    new Noty({
      type: 'success',
      theme: 'relax',
      layout: 'topRight',
      text: 'Автомобиль успешно удален',
      timeout: 1000,
    }).show();
  } else {
    new Noty({
      type: 'error',
      theme: 'relax',
      layout: 'topRight',
      text: 'Ошибка удаления автомобиля',
      timeout: 1000,
    }).show();
  }
}

/* Добавить автомобиль в базу данных */
const addAuto = async (number,name) => {
  const url1 = `${url}/cars/add`;
  const settings = {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      number,
      name,
    }),
  }
  try {
    const response = await fetch(url1,settings);
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Ошибка HTTP: " + response.status);
    }
  } catch (e) {
    console.log("Ошибка добавления автомобиля в базу данных!");
  }
}
const addAutoResp = respond => {
  if (respond) {
    new Noty({
      type: 'success',
      theme: 'relax',
      layout: 'topRight',
      text: 'Автомобиль успешно добавлен',
      timeout: 1000,
    }).show();
  } else {
    new Noty({
      type: 'error',
      theme: 'relax',
      layout: 'topRight',
      text: 'Ошибка добавления автомобиля в базу',
      timeout: 1000,
    }).show();
  }
}

/* Получить список всех автомобилей */
const getListAuto = async (number) => {
  const url1 = `${url}/cars?offset=${number}`;
  globalNumber = number;
  try {
    const response = await fetch(url1);
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Ошибка HTTP: " + response.status);
    }
  } catch (e) {
    new Noty({
      type: 'error',
      theme: 'relax',
      layout: 'topRight',
      text: 'Ошибка получения списка автомобилей от сервера',
      timeout: 1000,
    }).show();
    console.log("Ошибка получения списка автомобилей от сервера");
  }
}

/* Заполнение таблицы */
const fillTable = array => {
  const table = document.querySelector('.table tbody');
  const checkbox ='<i class="material-icons delete-auto">delete_forever</i>';
  table.innerHTML = "";
  for (let i of array) {
    let str = "<tr>";
    str += `<td>${checkbox}</td>`;
    str += `<td>${i['number']}</td>`;
    str += `<td>${i['name']}</td>`;
    str += "</tr>";
    table.innerHTML += str;
  }
}




/* Обработка нажатия кнопки "Добавить авто" */
document.querySelector('.add-btn').addEventListener('click',function(e) {
  e.preventDefault();
  document.querySelector('.form-area').style.display = 'block';
});

/* Обработка нажатия на "крестик" для закрытия формы добавления */
document.querySelector('.crest').addEventListener('click',function(e) {
  e.preventDefault();
  document.querySelector('.form-area').style.display = 'none';
});

/* Обработка удаления автомобиля */
document.querySelector('.table').addEventListener('click',function(e) {
  const target = e.target;
  
  if (target.classList.contains('delete-auto')) {
    const number = target.parentNode.parentNode.querySelector('td:nth-child(2)').innerHTML.replace(/\s/g,"").toUpperCase();
    deleteAuto(number).then(deleteAutoResp).catch(viewError);
  }
});

/* Обработка нажатия на кнопку "Добавить" при добавлении автомобиля в базу */
document.querySelector('.form-button').addEventListener('click',function(e) {
  const number = document.querySelector('.form-number').value;
  const name = document.querySelector('.form-name').value;
  const form = document.querySelector('.form-area');

  if (checkNumber(number)) {
    if (checkName(name)) {
      form.style.display = 'none';
      addAuto(number,name).then(addAutoResp).catch(viewError);
    } else {
      new Noty({
        type: 'error',
        theme: 'relax',
        layout: 'topRight',
        text: 'Поле для ввода марки не должно быть пустым',
        timeout: 1000,
      }).show();
    }
  } else {
    new Noty({
      type: 'error',
      theme: 'relax',
      layout: 'topRight',
      text: 'Неправильно введён номер',
      timeout: 1000,
    }).show();
  }
});
const checkNumber = value => {
  const r = /^[АВЕКМНОРСТУХ]\d{3}(?<!000)[АВЕКМНОРСТУХ]{2}\d{2,3}$/ui;
  if (value.match(r)){
    return true;
  } else {
    return false;
  }
}
const checkName = value => {
  if (value.length > 1) {
    return true;
  } else {
    return false;
  }
}
