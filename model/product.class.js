'use strict';

export class Product {
    constructor (id, name, price = 0, units = 0) {
        this.id = id;
        this.name = name;
        this.price = Number(price);
        this.units = Number(units);
    }

    get getID() {return this.id;}
    get getName() {return this.name;}
    get getPrice() {return this.price;}
    get getUnits() {return this.units;}
    set setName(name) {this.name = name;}
    set setPrice(price) {this.price = price;}
    set setUnits(units) {this.units = units;}


    changeUnits(units) {
        if (this.units+Number(units)<0 || this.units+Number(units)>100) return false;
        else {
            this.units+=Number(units);
            return true;
        }
    }

    productImport() {return (this.price*this.units).toFixed(2);}
}