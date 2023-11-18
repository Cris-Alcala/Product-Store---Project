'use strict';

// document.addEventListener('contextmenu', (e) => {
//     e.preventDefault();
// });
// document.addEventListener('keydown', (e) => {
//     (e.ctrlKey && e.key=='u')?e.preventDefault():null;
//     (e.key=='F12')?e.preventDefault():null;
// });

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(res => console.log("service worker registered", res))
        .catch(err => console.log("service worker not registered", err))
    })
  }

import {StoreController} from './controller/controller.js';

let lastProduct = null;
let storeController = new StoreController();
let newProd = document.getElementById('newProd');
let idInput = newProd.querySelector('#newProd-id');
let nameInput = newProd.querySelector('#newProd-name');
let unitsInput = newProd.querySelector('#newProd-units');
let priceInput = newProd.querySelector('#newProd-price');
let h2 = document.querySelector('h2');
let button = document.querySelector('.recovery');
let buttonSubmit = document.querySelector('[type="submit"]');

newProd.addEventListener('click', (e) => {
    if (e.target==h2) {
        newProd.classList.toggle('expand');
        newProd.classList.toggle('hided');
    }
});

idInput.addEventListener('keyup', () => {
    storeController.checkProductInStore(idInput.value);
})

newProd.addEventListener('submit', e => {
    e.preventDefault();
    storeController.checkID();
    storeController.checkName();
    storeController.checkUnits();
    storeController.checkPrice();
    if (storeController.checkID()&&storeController.checkName()&&storeController.checkUnits()&&storeController.checkPrice()) {
        let formData = new FormData(newProd);
        if (storeController.inStoreProduct(formData.get('newProd-id'))==undefined) {
            storeController.addProductToStore(formData.get('newProd-id'), formData.get('newProd-name'), formData.get('newProd-price'), formData.get('newProd-units'));
        }  else {
            lastProduct = storeController.changeProductInStore(formData.get('newProd-id'), formData.get('newProd-name'), Number(formData.get('newProd-price')), Number(formData.get('newProd-units')));
        }
        let inputs = document.querySelectorAll('input');
        let status = document.querySelectorAll('.status_check');
        status.forEach(input => input.classList.remove('unchecked_radio'));
        status.forEach(input => input.classList.remove('checked_radio'));
        inputs.forEach(input => input.classList.remove('unchecked-input'));
        inputs.forEach(input => input.classList.remove('checked-input'));
        newProd.querySelectorAll('input').forEach(input => input.value = "");
        newProd.classList.remove('expand');
        newProd.classList.add('hided');
    } else storeController.showMessage('Error al registrar el producto')
});

newProd.addEventListener('reset', () => {
    let inputs = document.querySelectorAll('input');
    let status = document.querySelectorAll('.status_check');
    status.forEach(input => input.classList.remove('unchecked_radio'));
    status.forEach(input => input.classList.remove('checked_radio'));
    inputs.forEach(input => input.classList.remove('unchecked-input'));
    inputs.forEach(input => input.classList.remove('checked-input'));
    buttonSubmit.innerHTML='Añadir';
})

button.addEventListener('click', (e) => {
    let inputID = newProd.querySelector('#newProd-id');
    let inputName = newProd.querySelector('#newProd-name');
    let inputUnits = newProd.querySelector('#newProd-units');
    let inputPrice = newProd.querySelector('#newProd-price');
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

idInput.addEventListener('keyup', () => {
    storeController.checkID();
});
nameInput.addEventListener('keyup', () => {
    storeController.checkName();
});
unitsInput.addEventListener('keyup', () => {
    storeController.checkUnits();
});
priceInput.addEventListener('keyup', () => {
    storeController.checkPrice();
});