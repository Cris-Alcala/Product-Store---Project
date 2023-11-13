'use strict';

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(res => console.log("service worker registered", res))
        .catch(err => console.log("service worker not registered", err))
    })
  }

import {StoreController} from './controller/controller.js';

let firsTime = 0;
let lastProduct = null;
let storeController = new StoreController();
let newProd = document.getElementById('newProd');
let h2 = document.querySelector('h2');
let button = document.querySelector('.recovery');
let buttonSubmit = document.querySelector('[type="submit"]');
newProd.addEventListener('click', (e) => {
    firsTime++;
    if (e.target==h2) {
        newProd.classList.toggle('expand');
        if (firsTime!=1) {
            newProd.classList.toggle('hided');
        }
    }
});
newProd.addEventListener('submit', e => {
    e.preventDefault();
    let formData = new FormData(newProd);
    if (formData.get('newProd-id')=='') {
        storeController.addProductToStore(formData.get('newProd-name'), formData.get('newProd-price'), formData.get('newProd-units'));
        newProd.querySelectorAll('input').forEach(input => input.value = "");
    }  else {
        lastProduct = storeController.changeProductInStore(Number(formData.get('newProd-id')), formData.get('newProd-name'), Number(formData.get('newProd-price')), Number(formData.get('newProd-units')))
        newProd.querySelectorAll('input').forEach(input => input.value = "");
    }
    newProd.classList.remove('expand');
    newProd.classList.add('hided');
});

newProd.addEventListener('reset', () => {
    buttonSubmit.innerHTML='Añadir';
})

button.addEventListener('click', (e) => {
    let form = document.querySelector('form');
    let inputID = form.querySelector('#newProd-id');
    let inputName = form.querySelector('#newProd-name');
    let inputUnits = form.querySelector('#newProd-units');
    let inputPrice = form.querySelector('#newProd-price');
    if (inputID.innerHTML=='') {
        if (lastProduct!=null) {
            e.preventDefault();
            buttonSubmit.innerHTML='Actualizar';
            inputID.value=lastProduct.getID;
            inputName.value=lastProduct.getName;
            inputUnits.value=lastProduct.getUnits;
            inputPrice.value=lastProduct.getPrice;
        } else storeController.showMessage('No hay productos actualizados recientemente');
    } 
});
