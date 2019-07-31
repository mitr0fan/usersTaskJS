var xhr=new XMLHttpRequest();						//создаю новый http-запрос
xhr.open('GET',
'https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture',
 true);												//со следующими параметрами
xhr.send();											//и отправляю его

var users;											//переменная с массивом из пользователей
var div=document.createElement('div');				//окно, в котором будет находиться вся информация
div.classList.add('main');
document.body.insertBefore(div,null);


xhr.onreadystatechange=function() {					//обработчик ответа
	if (this.readyState!=4) return;					//если состояние запроса не '4', то ничего не делать
	if(this.status!=200) {							//если Statuscode не равен 200(успех), то вывести ошибку
	alert('Ошибка '+this.status+':'+this.statusText);
	}
	var response=JSON.parse(xhr.responseText);		//переменная с объектом в формате {results:[...], info:{...}}
	users=response.results;							//массив с пользователями

	usersList(users);								//вызов функции, создающей список пользователей

};


function usersList(usersArr) {						//создание или изменение списка пользователей
	usersArr.forEach(function(item){				//изм массив, чтобы было покрасивее
		item.name.first=item.name.first[0].toUpperCase()+item.name.first.slice(1);
		item.name.last=item.name.last[0].toUpperCase()+item.name.last.slice(1);
		item.location.street=item.location.street.toUpperCase();
		item.location.city=item.location.city.toUpperCase();
		item.location.state=item.location.state.toUpperCase();
	})
	if(div.querySelector('ul')==null) {				//создаем список
		var ul=document.createElement('ul');
		ul.classList.add('usersList');
		var spanDiv=document.createElement('div');
		var spanSort=document.createElement('span');
		spanSort.id='spanSort';
		spanSort.innerHTML='<span id="reverse">'+'↻'+'</span>'+' '+'<span id="alphabet">'+'▼ Aa'+'</span>';
		for (var i=0; i<usersArr.length; i++) {
			var li=document.createElement('li');
			li.id=i;
			var img=document.createElement('img');
			var span=document.createElement('span');
			img.src=usersArr[i].picture.medium;
			span.textContent=usersArr[i].name.title+' '+usersArr[i].name.first+' '+usersArr[i].name.last;
			li.insertBefore(img,null);
			li.insertBefore(span,null);
			ul.insertBefore(li,null);
		}
		spanDiv.insertBefore(spanSort,null);
		div.insertBefore(ul,null);
		div.insertBefore(spanDiv,null);
		spanSort.parentElement.id='divSort';
	}
	else {											//если список уже создан то только изменяем его элементы
		var ul=document.getElementsByClassName('usersList')[0];
		var li=ul.querySelectorAll('li');
		var img=ul.querySelectorAll('img');
		var span=ul.querySelectorAll('span');
		for (var i=0; i<usersArr.length; i++) {
			li.id=i;
			img[i].src=usersArr[i].picture.medium;
			span[i].textContent=usersArr[i].name.title+' '+usersArr[i].name.first+' '+usersArr[i].name.last;
		}
	}

	ul.onclick=function(event) {					//обработчик клика на пользователя со всплытием окна с информацией
		if(event.target.tagName=='LI' || event.target.parentNode.tagName=='LI') {
			var userNbr;
				if(event.target.tagName=='LI'){
					userNbr=event.target.id;
				}
				else userNbr=event.target.parentNode.id;
			if(document.getElementById('popup')==null) {
				var popup=document.createElement('div');
				popup.id='popup';
				var bigImg=document.createElement('img');
				var information=document.createElement('div');
				var close=document.createElement('span');
				var background=document.createElement('div');
				background.id='background';
				information.id='info';
				bigImg.id='bigImg';
				close.id='closeButton';
				close.textContent='✕';
				popup.insertBefore(bigImg,null);
				popup.insertBefore(information,null);
				popup.insertBefore(close,null);
				div.insertBefore(popup,null);
				document.body.insertBefore(background,null);
			}
			else {
				var popup=document.getElementById('popup');
				var bigImg=document.getElementById('bigImg');
				var information=document.getElementById('info');
				var close=document.getElementById('closeButton');
				var background=document.getElementById('background');
			}
			bigImg.src=usersArr[userNbr].picture.large;
			information.innerHTML='<ul><li>'+usersArr[userNbr].name.title+' '+usersArr[userNbr].name.first+' '+
			usersArr[userNbr].name.last+'</li><li>'+'Street: '+users[userNbr].location.street+'</li><li>'+
			'City: '+users[userNbr].location.city+'</li><li>'+'State: '+users[userNbr].location.state+'</li><li>'+
			'E-mail: '+users[userNbr].email+'</li><li>'+'Phone-number: '+users[userNbr].phone+'</li></ul>';
			popup.style.top=0+'px';
			popup.style.boxShadow='0 0 1000px 100px';
			background.style.visibility='visible';
			

			close.onclick=function() {					//клик на крестик скрывает всплывающее окно
				popup.style.top=-400+'px';
				popup.style.boxShadow='0 0 0px 0px';
				background.style.visibility='hidden';
			}
		}
	}

	if(spanSort!=undefined){						//сортировка пользователей
		spanSort.onclick=function(event) {			//по алфавиту по первой букве имени
			if(event.target.id=='alphabet') {
				users.sort(function(a,b) {
				if(a.name.first>b.name.first) return 1;
				if(a.name.first<b.name.first) return -1;
				});
			}
			else users.reverse();					//обратный порядок
			usersList(users);
		}
	}
}