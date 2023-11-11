'use strict';

export class Store {
    #id;

    constructor (id) {
        this.#id = id;
        this.products = [];
    }

    get getID() {return this.#id;}
    get getProducts() {return this.products;}

    findProduct(productId) {return this.products.find(product => product.getID == productId);}
    addProduct(product) {
        if (!this.findProduct(product.getID)) {
            this.products.push(product);
            return product;
        } else return null;
    }

    delProduct(productId) {
        let indexProduct = this.products.findIndex(product => product.getID == productId);
        if (indexProduct!==-1) {
            let product = this.products[indexProduct];
            this.products.splice(indexProduct,1);
            return product;
        } else return null;
    }

    modProduct(productId, name, price, units) {
        let indexProduct = this.products.findIndex(product => product.getID==productId);
        if (indexProduct!==-1) {
            if (name!=="" || name!==null) this.products[indexProduct].setName = name;
            if (price !== null) this.products[indexProduct].setPrice = price;
            if (units !== null) this.products[indexProduct].setUnits = units;
            return this.products[indexProduct];
        } else return null;
    }

    changeProductUnits(productId, units) {
        let indexProduct = this.products.findIndex(product => product.getID == productId);
        if (indexProduct!==-1) {
            if (this.products[indexProduct].changeUnits(units)) {
                return this.products[indexProduct];
            }else return null;
        } else return null;
    }

    totalImport() {return this.products.reduce((total, product) => total+=product.productImport(),0)};

    underStock(units) {return this.products.filter(product => product.getUnits<units);}

    orderByUnits() {return this.products.sort((a,b) => (a.getUnits)-(b.getUnits));}

    orderByName() {return this.products.sort((a,b) => a.getName.localeCompare(b.getName));}
}