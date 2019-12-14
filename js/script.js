const viewError = error => {
  console.error(error);
}

/* Обработка отправки картинки на сервер */
const sendPicture = async () => {
  const url = "http://haha";
  const settings = {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: new FormData(document.getElementById('main-form')),
  }
  try {
    document.querySelector('.loader').style.display = 'inline-block';
    document.querySelector('#img').style.display = 'none';
    document.querySelector('.auto').style.opacity = '0';

    const response = await fetch(url,settings);

    if (response.ok) {
      document.querySelector('.loader').style.display = 'none';
      document.querySelector('#img').style.display = 'inline-block';
      return await response.json();
    } else {
      document.querySelector('.loader').style.display = 'none';
      console.error("Ошибка HTTP: " + response.status);
    }
  } catch (e) {
    document.querySelector('.loader').style.display = 'none';
    document.querySelector('.auto').style.opacity = '1';
    failDownloadPicture();
    console.log("Ошибка отправка картинки на сервер");
  }
};
const sendPictureResp = respond => {

};

/* Form */
document.querySelector("input[type='file']").addEventListener('change', function(e) {
  sendPicture(this.value).then(sendPictureResp).catch(viewError);
});

/* Возможные ответы от сервера */
const success = (number, name) => {
  const b = document.querySelector('.respond');
  const frame = document.querySelector('.main-photo-img');
  const spanNumber = document.getElementById('number');
  const spanName = document.getElementById('name');

  b.style.display = 'inline-block';
  b.innerHTML = "Въезд разрешён";
  b.style.background = "#56b651";
  frame.style.border = "2px solid #56b651";
  spanNumber.innerHTML = number;
  spanName.innerHTML = name;
}
const fail = (number) => {
  const b = document.querySelector('.respond');
  const frame = document.querySelector('.main-photo-img');
  const spanNumber = document.getElementById('number');
  const spanName = document.getElementById('name');

  b.style.display = 'inline-block';
  b.innerHTML = "Въезд запрещён";
  b.style.background = "#b04949";
  frame.style.border = "2px solid #b04949";
  spanNumber.innerHTML = number;
  spanName.innerHTML = "";
}
const unknown = () => {
  const b = document.querySelector('.respond');
  const frame = document.querySelector('.main-photo-img');
  const spanNumber = document.getElementById('number');
  const spanName = document.getElementById('name');

  b.style.display = 'inline-block';
  b.innerHTML = "Номер не распознан";
  b.style.background = "#b0a349";
  frame.style.border = "2px solid #b0a349";
  spanNumber.innerHTML = "";
  spanName.innerHTML = "";
}
const failDownloadPicture = () => {
  const b = document.querySelector('.respond');
  const frame = document.querySelector('.main-photo-img');
  const spanNumber = document.getElementById('number');
  const spanName = document.getElementById('name');

  b.style.display = 'inline-block';
  b.innerHTML = "Ошибка загрузки фото";
  b.style.background = "#b04949";
  frame.style.border = "2px solid #b04949";
  spanNumber.innerHTML = "";
  spanName.innerHTML = "";
}
