let glNumber = localStorage.getItem('number') ? localStorage.getItem('number') : 0;
let glUrl = "http://127.0.0.1:3012";

const viewError = error => {
  console.error(error);
}

/* Удалить автомобиль из базы данных */
const deleteAuto = async (id) => {
  const url = `${glUrl}/cars/remove/${id}`;
  const settings = {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }
  try {
    const response = await fetch(url,settings);
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
  if (respond['status']) {
    new Noty({
      type: 'success',
      theme: 'relax',
      layout: 'topRight',
      text: 'Автомобиль успешно удален',
      timeout: 1000,
    }).show();

    getListAuto(glNumber).then(fillTable).catch(viewError)
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
  const url = `${glUrl}/cars/add`;
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
    const response = await fetch(url,settings);
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
  if (respond['status']) {
    new Noty({
      type: 'success',
      theme: 'relax',
      layout: 'topRight',
      text: 'Автомобиль успешно добавлен',
      timeout: 1000,
    }).show();
    
    getListAuto(glNumber).then(fillTable).catch(viewError)
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

/* Получение кол-ва страниц */
const getPages = async () => {
  const url = `${glUrl}/pages`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Ошибка HTTP: " + response.status);
    }
  } catch (e) {
    console.log("Ошибка получения списка страниц!");
  }
}
const addPagesOnSite = (pages) => {
  let currentPage = glNumber + 1;
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = "";
  if (pages !== undefined) {
    if (pages <= 6) {
      for(let i = 1; i <= 6; i++) {
        if (i != currentPage)
          pagination.innerHTML += `<span class="pagination-link" data-id="${i-1}">${i}</span>\n`;
        else 
          pagination.innerHTML += `<span class="pagination-link main-link" data-id="${i-1}">${i}</span>\n`;
      }
    } else {
      if (currentPage < 4) {
        for(let i = 1; i <= 3; i++) {
          if (i != currentPage)
            pagination.innerHTML += `<span class="pagination-link" data-id="${i-1}">${i}</span>\n`;
          else 
            pagination.innerHTML += `<span class="pagination-link main-link" data-id="${i-1}">${i}</span>\n`;
        }
        if (currentPage == 3) {
          pagination.innerHTML += `<span class="pagination-link main-link" data-id="${3}">${4}</span>\n`;
        }
        pagination.innerHTML += `<span class="dots">...</span>\n`;
        pagination.innerHTML += `<span class="pagination-link" data-id="${pages-1}">${pages}</span>\n`;
      } else if (currentPage > pages - 3) {
        pagination.innerHTML += `<span class="pagination-link" data-id="${0}">${1}</span>\n`;
        pagination.innerHTML += `<span class="dots">...</span>\n`;
        if (pages-2 == currentPage) {
          pagination.innerHTML += `<span class="pagination-link" data-id="${currentPage-2}">${currentPage-1}</span>\n`;
        }
        for(let i = pages-2; i <= pages; i++) {
          if (i != currentPage)
            pagination.innerHTML += `<span class="pagination-link" data-id="${i-1}">${i}</span>\n`;
          else 
            pagination.innerHTML += `<span class="pagination-link main-link" data-id="${i-1}">${i}</span>\n`;
        }
      } else {
        pagination.innerHTML += `<span class="pagination-link" data-id="${0}">${1}</span>\n`;
        pagination.innerHTML += `<span class="dots">...</span>\n`;
        for(let i = currentPage-1; i <= currentPage+1; i++) {
          if (i != currentPage)
            pagination.innerHTML += `<span class="pagination-link" data-id="${i-1}">${i}</span>\n`;
          else 
            pagination.innerHTML += `<span class="pagination-link main-link" data-id="${i-1}">${i}</span>\n`;
        }
        pagination.innerHTML += `<span class="dots">...</span>\n`;
        pagination.innerHTML += `<span class="pagination-link" data-id="${pages-1}">${pages}</span>\n`;
      }
    }
  }
}

/* Получить список всех автомобилей */
const getListAuto = async (number) => {
  const url = `${glUrl}/cars?offset=${number}`;
  glNumber = number;
  localStorage.setItem('number',glNumber);
  try {
    const response = await fetch(url);
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
    str += `<td data-id="${i['_id']}">${checkbox}</td>`;
    str += `<td>${i['number']}</td>`;
    str += `<td>${i['name']}</td>`;
    str += "</tr>";
    table.innerHTML += str;
  }
}

//getPages().then(addPagesOnSite).catch(viewError);
//getListAuto(glNumber).then(fillTable).catch(viewError);


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
    const number = target.parentNode.getAttribute('data-id');
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

/* Переход по страницам таблицы */
document.querySelectorAll('.pagination-link').forEach(val => {
  val.addEventListener('click',function(e) {
    const page = this.getAttribute("data-id");
    glNumber = page;
    localStorage.setItem('numer',glNumber);

    getPages().then(addPagesOnSite).catch(viewError);
    getListAuto(glNumber).then(fillTable).catch(viewError);
  });
});