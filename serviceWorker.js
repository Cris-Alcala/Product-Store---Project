const staticStore = "2daw-store-storage"
const assets = [
  "/Projects/StoreProjectV1",
  "/Projects/StoreProjectV1/index.html",
  "/Projects/StoreProjectV1/css/style.css",
  "/Projects/StoreProjectV1/main.js",
  "/Projects/StoreProjectV1/controller/controller.js",
  "/Projects/StoreProjectV1/model/product.class.js",
  "/Projects/StoreProjectV1/model/store.class.js",
  "/Projects/StoreProjectV1/view/view.js",
  "/Projects/StoreProjectV1/img/eliminar.png",
  "/Projects/StoreProjectV1/img/flecha-abajo.png",
  "/Projects/StoreProjectV1/img/flecha-arriba.png",
  "/Projects/StoreProjectV1/img/modificar.png",
  "/Projects/StoreProjectV1/img/shortcuts/almacen72.png",
  "/Projects/StoreProjectV1/img/shortcuts/almacen96.png",
  "/Projects/StoreProjectV1/img/shortcuts/almacen128.png",
  "/Projects/StoreProjectV1/img/shortcuts/almacen144.png",
  "/Projects/StoreProjectV1/img/shortcuts/almacen152.png",
  "/Projects/StoreProjectV1/img/shortcuts/almacen192.png",
  "/Projects/StoreProjectV1/img/shortcuts/almacen384.png",
  "/Projects/StoreProjectV1/img/shortcuts/almacen512.png",
];

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