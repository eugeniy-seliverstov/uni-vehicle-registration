let scaleWidth = 1, scaleHeight = 1
const widthBox = 300, heightBox = 350;

const viewError = error => {
  console.error(error);
  loadImgToBox(document.querySelector('input[name="image"]'));
}

/* Обработка отправки картинки на сервер */
const sendPicture = async () => {
  const url = "http://127.0.0.1:3012/check";
  const settings = {
    method: "POST",
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
    console.log("Ошибка отправки картинки на сервер");
  }
};

const sendPictureResp = async respond => {
  if (!respond) return;
  let {status, found, car, result} = respond;
  await loadImgToBox(document.querySelector('input[name="image"]'));

  if (status) {
    if (found) {
      success(car.number, car.name);
      drawFrame(result.points[0], true);
    } else {
      fail(result.text);
      drawFrame(result.points[0], false);
    }
  } else {
    unknown();
  }
};

/* Form */
document.querySelector("input[type='file']").addEventListener('change', function(e) {
  const picture = document.querySelector("#img");
  document.getElementById("canvas").getContext("2d").clearRect(0,0,300,350);
  scaleWidth = 1, scaleHeight = 1;
  picture.style.display = "none";
  
  sendPicture(this.value).then(sendPictureResp).catch(viewError);
});

/* Помещение картинки в бокс */
const loadImgToBox = (input) => {
  return new Promise((resolve, reject) => {
    const picture = document.querySelector("#img");
    let reader = new FileReader();
  
    reader.onload = e => {
      picture.src = e.target.result;
  
      let img = document.createElement('img');
      img.onload = function() {
        scaleHeight = this.height / heightBox;
        scaleWidth = this.width / widthBox;
        resolve();
      };
      img.src = e.target.result;
    }
  
    reader.readAsDataURL(input.files[0]);
    picture.style.display = "inline-block";
  });
}

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

/* Рисование рамки | points - массив вершин прямоугольника, type - зелёная или красная */
const drawFrame = (points, type) => {
  points.forEach((val,i) => {
    points[i][0] /= scaleWidth;
    points[i][1] /= scaleHeight;
  });
  let [[x1, y1], [x2, y2],[x3, y3],[x4, y4]] = points;
  let canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d"),
      strokeStyle = type ? "#56b651" : "#b04949";
  ctx.lineWidth = 2;
  ctx.strokeStyle = strokeStyle;
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.lineTo(x3,y3);
  ctx.lineTo(x4,y4);
  ctx.lineTo(x1,y1);
  ctx.closePath();
  ctx.stroke();
}