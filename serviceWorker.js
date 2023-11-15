const staticStore = "2daw-store-storage"
// const assets = [
//   "/",
//   "/index.html",
//   "/css/style.css",
//   "/main.js",
//   "/controller/controller.js",
//   "/model/product.class.js",
//   "/model/store.class.js",
//   "/view/view.js",
//   "/img/eliminar.png",
//   "/img/flecha-abajo.png",
//   "/img/flecha-arriba.png",
//   "/img/modificar.png",
//   "/img/shortcuts/almacen72.png",
//   "/img/shortcuts/almacen96.png",
//   "/img/shortcuts/almacen128.png",
//   "/img/shortcuts/almacen144.png",
//   "/img/shortcuts/almacen152.png",
//   "/img/shortcuts/almacen192.png",
//   "/img/shortcuts/almacen384.png",
//   "/img/shortcuts/almacen512.png",
// ];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticStore).then(cache => {
      cache.addAll(assets)
    })
  )
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
});