'use strict';

import {Store} from '../model/store.class.js';
import {StoreView} from '../view/view.js';
import {Product} from '../model/product.class.js';

export class StoreController {
    constructor() {
        this.productStore = new Store(1);
        this.storeView = new StoreView();
    }

    addProductToStore(name, price, units) {
        let product = new Product(name, price, units);
        const newProd = this.productStore.addProduct(product);
        if (newProd!==null) {
            let tr = this.storeView.renderNewProduct(product);
            let imgMore = tr.querySelector('td:last-child img:first-child');
            let imgLess = tr.querySelector('td:last-child img:nth-child(2)');
            let imgDel = tr.querySelector('td:last-child img:nth-child(4)');
            imgMore.addEventListener('click', () => {
                this.addProductStock(Number(imgMore.className));
            });
            imgLess.addEventListener('click', () => {
                this.delProductStock(Number(imgLess.className));
            });
            imgDel.addEventListener('click', () => {
                this.deleteProductFromStore(Number(imgDel.className));
            });
            this.storeView.renderSuccessMessage('Añadido correctamente');
            this.storeView.renderStoreImport();
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
                        } else this.storeView.renderErrorMessage('Error al eliminar');
                    } else this.storeView.renderSuccessMessage('Producto conservado');
                } else {
                    const delProd = this.productStore.delProduct(productId);
                    if (delProd!==null) this.storeView.renderDelProduct(productId);
                    else this.storeView.renderErrorMessage('Error al eliminar');
                }
            } else this.storeView.renderSuccessMessage('Producto conservado');
        } else this.storeView.renderErrorMessage('Producto no encontrado');
    }

    addProductStock(productID) {
        const stockProd = this.productStore.changeProductUnits(productID, 1);
        if (stockProd!==null) {
            this.storeView.renderChangeStock(stockProd);
            this.storeView.renderSuccessMessage('Unidades actualizadas correctamente');
            this.storeView.renderStoreImport();
        } else this.storeView.renderErrorMessage('Stock mínimo');
    }

    delProductStock(productID) {
        const stockProd = this.productStore.changeProductUnits(productID, -1);
        if (stockProd!==null) {
            this.storeView.renderChangeStock(stockProd);
            this.storeView.renderSuccessMessage('Unidades actualizadas correctamente');
            this.storeView.renderStoreImport();
        } else this.storeView.renderErrorMessage('Stock mínimo');
    }

    changeProductInStore(productId, name, price, units){
        const modProd = this.productStore.modProduct(productId, name, price, units);
        console.log(modProd);
        if (modProd!==null) {
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
