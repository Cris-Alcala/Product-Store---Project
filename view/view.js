'use strict';

export class StoreView {

    
    constructor(){
        this.prodalert = document.getElementById('prodAlert');
        this.prodsList = document.getElementById('prodList');
        this.productList = this.prodsList.querySelectorAll('tr');
        this.newForm = document.getElementById('newProd');
    }

    renderNewProduct(newProduct) {
        this.prodsList.classList.add('display');
        let tr = document.createElement('tr');
        let tdId = document.createElement('td');
        tdId.innerHTML=newProduct.getID;
        let tdName = document.createElement('td');
        tdName.innerHTML=newProduct.getName;
        let tdUds = document.createElement('td');
        tdUds.innerHTML=newProduct.getUnits;
        let tdPrice = document.createElement('td');
        tdPrice.innerHTML=newProduct.getPrice;
        let tdImport = document.createElement('td');
        tdImport.innerHTML=newProduct.productImport()+' €';
        let tdAction = document.createElement('td');
        let imgMoreStock = document.createElement('img');
        imgMoreStock.setAttribute('src', 'img/flecha-arriba.png');
        imgMoreStock.setAttribute('class', newProduct.getID);
        // imgMoreStock.setAttribute('style', 'visibility:hidden');
        let imgLessStock = document.createElement('img');
        imgLessStock.setAttribute('src', 'img/flecha-abajo.png');
        imgLessStock.setAttribute('class', newProduct.getID);
        // imgLessStock.setAttribute('style', 'visibility:hidden');
        let imgModProduct = document.createElement('img');
        // imgModProduct.setAttribute('style', 'visibility:hidden');
        imgModProduct.setAttribute('src', 'img/modificar.png');
        let imgDelProduct = document.createElement('img');
        imgDelProduct.setAttribute('src', 'img/eliminar.png');
        imgDelProduct.setAttribute('class', newProduct.getID);
        // imgDelProduct.setAttribute('style', 'visibility:hidden');
        tr.append(tdId);
        tr.append(tdName);
        tr.append(tdUds);
        tr.append(tdPrice);
        tr.append(tdImport);
        tdAction.append(imgMoreStock);
        tdAction.append(imgLessStock);
        tdAction.append(imgModProduct);
        tdAction.append(imgDelProduct);
        tr.append(tdAction);
        this.prodsList.querySelector('tr:last-child').before(tr);
        return tr;
    }
    
    renderDelProduct(productID, last=false) {
        if (last==false) {
            this.prodsList.querySelectorAll('tr:nth-child(n+2)').forEach(product => (product.querySelector('td').innerHTML==productID)?product.remove():null);
        } else {
            this.prodsList.classList.remove('display');
            this.prodsList.querySelectorAll('tr:nth-child(n+2)').forEach(product => (product.querySelector('td').innerHTML==productID)?product.remove():null);
        }
    }
    
    renderChangeStock(newProduct) {
        let productsWithoutHeaders = this.prodsList.querySelectorAll('tr:nth-child(n+2)');
        productsWithoutHeaders.forEach(product => {
            if (product.querySelector('td').innerHTML==newProduct.getID) {
                product.querySelector(':nth-child(3)').innerHTML=newProduct.getUnits;
                product.querySelector(':nth-child(5)').innerHTML=newProduct.productImport()+' €';
            }
            
        });
    }
    
    renderEditProduct(newProduct) {
        let submit = this.newForm.querySelector('[type="submit"]');
        let products = this.prodsList.querySelectorAll('tr:nth-child(n+2)');
        let product;
        products.forEach(product_ => (product_.querySelector('td').innerHTML==newProduct.getID)?product=product_:null);
        product.querySelector('td:first-child').innerHTML=newProduct.getID;
        product.querySelector('td:nth-child(2)').innerHTML=newProduct.getName;
        product.querySelector('td:nth-child(3)').innerHTML=newProduct.getUnits;
        product.querySelector('td:nth-child(4)').innerHTML=newProduct.getPrice;
        product.querySelector('td:nth-child(5)').innerHTML=newProduct.productImport()+' €';
        submit.innerHTML='Añadir';
        this.renderStoreImport();
    }

    renderStoreImport() {
        let total = 0;
        let products = this.prodsList.querySelectorAll('tr:nth-child(n+2)');
        for (let i = 0; i<products.length-1;i++) {
            total+=Number(products[i].querySelector('td:nth-child(5)').innerHTML.substring(0,products[i].querySelector('td:nth-child(5)').innerHTML.length-1))
        }
        this.prodsList.querySelector('tr:last-child').querySelector('td:last-child').querySelector('strong').innerHTML=total.toFixed(2)+' €';
    }

    renderErrorMessage(message) {
        document.getElementById('prodAlert').classList.remove('hide');
        if (document.getElementById('prodAlert').classList.contains('alert-success')) {
            document.getElementById('prodAlert').classList.remove('alert-success');
            document.getElementById('prodAlert').classList.add('alert-danger');
        } else {
            document.getElementById('prodAlert').classList.add('alert-danger');
        }
        document.getElementById('prodAlert').innerHTML=message;
        setTimeout(this.disableMessage, 5000);
    }
    
    renderSuccessMessage(message) {
        document.getElementById('prodAlert').classList.remove('hide');
        if (document.getElementById('prodAlert').classList.contains('alert-danger')) {
            document.getElementById('prodAlert').classList.remove('alert-danger');
            document.getElementById('prodAlert').classList.add('alert-success');
        } else {
            document.getElementById('prodAlert').classList.add('alert-success');
        }
        document.getElementById('prodAlert').innerHTML=message;
        setTimeout(this.disableMessage, 5000);
    }

    disableMessage() {
        document.getElementById('prodAlert').classList.add('hide');
    }
}