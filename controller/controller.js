'use strict';

import {Store} from '../model/store.class.js';
import {StoreView} from '../view/view.js';
import {Product} from '../model/product.class.js';

export class StoreController {
    constructor() {
        this.productStore = new Store(1);
        this.storeView = new StoreView();
    }

    inStoreProduct(productID) {
        return this.productStore.findProduct(productID);
    }

    checkProductInStore(idProduct) {
        this.storeView.renderUpdateSubmitButton(this.inStoreProduct(idProduct));
    }

    checkID() {
        let regEx = /^[A-Z]{3}-[0-9]{4}$/;
        const INPUTID = document.getElementById('newProd-id');
        const SPAN = document.querySelector('.id-group .status_check');
        if (regEx.test(INPUTID.value)) {
            this.storeView.renderCheckStatus(INPUTID, SPAN);
            return true;
        } else this.storeView.renderUncheckStatus(INPUTID, SPAN);
        return false;
    }
    checkName() {
        let regEx = /^.{5,25}$/;
        const INPUTNAME = document.getElementById('newProd-name');
        const SPAN = document.querySelector('.name-group .status_check');
        if (regEx.test(INPUTNAME.value)) {
            this.storeView.renderCheckStatus(INPUTNAME, SPAN);
            return true;
        } else this.storeView.renderUncheckStatus(INPUTNAME, SPAN);
        return false;
    }
    checkUnits() {
        const INPUTUNITS = document.getElementById('newProd-units');
        const SPAN = document.querySelector('.units-group .status_check');
        let regEx = /^\d+$/;
        if (INPUTUNITS.value>=0 && INPUTUNITS.value<=100 && INPUTUNITS.value!='' && regEx.test(INPUTUNITS.value)) {
            this.storeView.renderCheckStatus(INPUTUNITS, SPAN);
            return true;
        } else this.storeView.renderUncheckStatus(INPUTUNITS, SPAN);
        return false;
    }
    checkPrice() {
        const INPUTPRICE = document.getElementById('newProd-price');
        const SPAN = document.querySelector('.price-group .status_check');
        if (INPUTPRICE.value>=0 && INPUTPRICE.value<=999.99 && INPUTPRICE.value!='') {
            this.storeView.renderCheckStatus(INPUTPRICE, SPAN);
            return true;
        } else this.storeView.renderUncheckStatus(INPUTPRICE, SPAN);
        return false;
    }

    async getProductsFromDB() {
        return await fetch('http://localhost:3000/products')
                        .then(response => response.json())
                        .then(data => data.forEach(product_ => {
                            let product = new Product(product_.product_id, product_.name, product_.price, product_.units);
                                const newProd = this.productStore.addProduct(product);
                                if (newProd!==null) {
                                    let tr = this.storeView.renderNewProduct(product);
                                    let imgMore = tr.querySelector('td:last-child img:first-child');
                                    let imgLess = tr.querySelector('td:last-child img:nth-child(2)');
                                    let imgMod = tr.querySelector('td:last-child img:nth-child(3)');
                                    let imgDel = tr.querySelector('td:last-child img:nth-child(4)');
                                    imgMore.addEventListener('click', () => {
                                        this.addProductStock(imgMore.className);
                                    });
                                    imgLess.addEventListener('click', () => {
                                        this.delProductStock(imgLess.className);
                                    });
                                    imgMod.addEventListener('click', () => {
                                        let inputID = this.storeView.newForm.querySelector('#newProd-id');
                                        let inputName = this.storeView.newForm.querySelector('#newProd-name');
                                        let inputUnits = this.storeView.newForm.querySelector('#newProd-units');
                                        let inputPrice = this.storeView.newForm.querySelector('#newProd-price');
                                        let submit = this.storeView.newForm.querySelector('button[type="submit"]');
                                        inputID.value=product.getID;
                                        inputName.value=product.getName;
                                        inputUnits.value=product.getUnits;
                                        inputPrice.value=product.getPrice;
                                        submit.innerHTML='Actualizar';
                                        this.checkID();
                                        this.checkName();
                                        this.checkUnits();
                                        this.checkPrice();
                                        this.storeView.newForm.classList.remove('hided');
                                        this.storeView.newForm.classList.add('expand');
                                    });
                                    imgDel.addEventListener('click', () => {
                                        this.deleteProductFromStore(imgDel.className);
                                    });
                                    this.storeView.renderSuccessMessage('Añadido correctamente');
                                    this.storeView.renderStoreImport();  
                            } else this.storeView.renderErrorMessage('Error al insertar');
                        }))
                        .catch(error => console.log(error.message));
    }

    async searchProductOnDB(productID) {
        let request = {
            method:'GET',
            headers: {
                'Content-Type':'application/json',
            },
        }
        return await fetch('http://localhost:3000/products?product_id='+productID, request)
                        .then(response => response.json())
                        .catch(error => console.log(error.message));
    }

    async addProductToDB(product) {
        let request = {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body : JSON.stringify({
                product_id:product.getID,
                name:product.getName,
                price:product.getPrice,
                units:product.getUnits,
            }),
        }
        return await fetch('http://localhost:3000/products', request)
                        .then(response => response.json())
                        .catch(error => error.message);
    }

    deleteProductFromDB(productID_) {
        this.searchProductOnDB(productID_)
            .then(async data => {
                    let request = {
                        method: 'DELETE',
                        headers: {
                            'Content-Type':'application/json'
                        },
                    }
                    return await fetch('http://localhost:3000/products/'+data[0].id, request)
                                    .then(response => response.json())
                                    .catch(error => console.log(error.message)); 
                })
    }



    addProductToStore(id, name, price, units) {
        let product = new Product(id, name, price, units);
        if (this.addProductToDB(product)) {  
            const newProd = this.productStore.addProduct(product);
            if (newProd!==null) {
                let tr = this.storeView.renderNewProduct(product);
                let imgMore = tr.querySelector('td:last-child img:first-child');
                let imgLess = tr.querySelector('td:last-child img:nth-child(2)');
                let imgMod = tr.querySelector('td:last-child img:nth-child(3)');
                let imgDel = tr.querySelector('td:last-child img:nth-child(4)');
                imgMore.addEventListener('click', () => {
                    this.addProductStock(imgMore.className);
                });
                imgLess.addEventListener('click', () => {
                    this.delProductStock(imgLess.className);
                });
                imgMod.addEventListener('click', () => {
                    let inputID = this.storeView.newForm.querySelector('#newProd-id');
                    let inputName = this.storeView.newForm.querySelector('#newProd-name');
                    let inputUnits = this.storeView.newForm.querySelector('#newProd-units');
                    let inputPrice = this.storeView.newForm.querySelector('#newProd-price');
                    let submit = this.storeView.newForm.querySelector('button[type="submit"]');
                    inputID.value=product.getID;
                    inputName.value=product.getName;
                    inputUnits.value=product.getUnits;
                    inputPrice.value=product.getPrice;
                    submit.innerHTML='Actualizar';
                    this.checkID();
                    this.checkName();
                    this.checkUnits();
                    this.checkPrice();
                    this.storeView.newForm.classList.remove('hided');
                    this.storeView.newForm.classList.add('expand');
                });
                imgDel.addEventListener('click', () => {
                    this.deleteProductFromStore(imgDel.className);
                });
                this.storeView.renderSuccessMessage('Añadido correctamente');
                this.storeView.renderStoreImport();  
        }
        } else this.storeView.renderErrorMessage('Error al insertar');
    }

    deleteProductFromStore(productId) {
        let product = this.productStore.findProduct(productId);
        if (product!==undefined) {
            let confirmDel = confirm(`¿Estás seguro de eliminar el producto con ID ${product.getID} y nombre ${product.getName}?`);
            if (confirmDel) {
                if (product.getUnits>0) {
                    confirmDel = confirm('Este producto tiene aún unidades sin vender ¿Estás seguro de su eliminación?');
                    if (confirmDel) {
                        const delProd = this.productStore.delProduct(productId);
                        if (delProd!==null) {
                            if (this.productStore.getProducts.length!=0) {
                                this.storeView.renderDelProduct(productId);
                            } else this.storeView.renderDelProduct(productId, true);
                            this.storeView.renderSuccessMessage('Eliminado correctamente');
                            this.storeView.renderStoreImport();
                            this.deleteProductFromDB(productId);
                        } else this.storeView.renderErrorMessage('Error al eliminar');
                    } else this.storeView.renderSuccessMessage('Producto conservado');
                } else {
                    const delProd = this.productStore.delProduct(productId);
                    if (delProd!==null) {
                        if (this.productStore.getProducts.length!=0) {
                            this.storeView.renderDelProduct(productId);
                        } else this.storeView.renderDelProduct(productId, true);
                        this.storeView.renderSuccessMessage('Eliminado correctamente');
                        this.storeView.renderStoreImport();
                        this.deleteProductFromDB(productId);
                    } else this.storeView.renderErrorMessage('Error al eliminar');
                }
            } else this.storeView.renderSuccessMessage('Producto conservado');
        } else this.storeView.renderErrorMessage('Producto no encontrado');
    }

    addProductStock(productID) {
        const stockProd = this.productStore.changeProductUnits(productID, 1);
        if (stockProd!==null) {
            this.searchProductOnDB(productID)
                .then(async data => {
                    let request = {
                        method: 'PATCH',
                        headers: {
                            'Content-Type':'application/json'
                        },
                        body : JSON.stringify({
                            name:data[0].name,
                            price:data[0].price,
                            units:data[0].units+1,
                        }),
                    }
                    return await fetch('http://localhost:3000/products/'+data[0].id,request)
                                    .then(response => response.json())
                                    .catch(error, console.log(error.message));
                })
            this.storeView.renderChangeStock(stockProd);
            this.storeView.renderSuccessMessage('Unidades actualizadas correctamente');
            this.storeView.renderStoreImport();
        } else this.storeView.renderErrorMessage('Stock Máximo');
    }

    delProductStock(productID) {
        const stockProd = this.productStore.changeProductUnits(productID, -1);
        if (stockProd!==null) {
            this.searchProductOnDB(productID)
                .then(async data => {
                    let request = {
                        method: 'PATCH',
                        headers: {
                            'Content-Type':'application/json'
                        },
                        body : JSON.stringify({
                            name:data[0].name,
                            price:data[0].price,
                            units:data[0].units-1,
                        }),
                    }
                    return await fetch('http://localhost:3000/products/'+data[0].id,request)
                                    .then(response => response.json())
                                    .catch(error, console.log(error.message));
                })
            this.storeView.renderChangeStock(stockProd);
            this.storeView.renderSuccessMessage('Unidades actualizadas correctamente');
            this.storeView.renderStoreImport();
        } else this.storeView.renderErrorMessage('Stock mínimo');
    }

    changeProductInStore(productID, name, price, units){
        const modProd = this.productStore.modProduct(productID, name, price, units);
        if (modProd!==null) {
            this.searchProductOnDB(productID)
                .then(async data => {
                    let request = {
                        method: 'PATCH',
                        headers: {
                            'Content-Type':'application/json'
                        },
                        body : JSON.stringify({
                            name:name,
                            price:price,
                            units:units,
                        }),
                    }
                    return await fetch('http://localhost:3000/products/'+data[0].id,request)
                                    .then(response => response.json())
                                    .catch(error, console.log(error.message));
                })
            this.storeView.renderEditProduct(modProd);
            this.storeView.renderStoreImport();
            this.storeView.renderSuccessMessage('Producto actualizado correctamente');
        } else this.storeView.renderErrorMessage('Error al modificar');
        return modProd;
    }

    showMessage(message) {
        this.storeView.renderErrorMessage(message);
    }
}
