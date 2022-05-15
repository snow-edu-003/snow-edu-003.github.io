'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "69f05b755b9d4f3a0e2a775e370b646a",
"assets/assets/fonts/jalnan.ttf": "6be3d80cc02d977f57c6dacced006461",
"assets/assets/fonts/lottemart-dream-bold.ttf": "9ea8cafad934a51f4d88c40132e958f5",
"assets/assets/images/ai_study_loading.gif": "c094f44d03d69511c2322da141996755",
"assets/assets/images/ans.png": "0c62b7f1c352f3678b4050b9e22e9df7",
"assets/assets/images/back.png": "ce5ebb716d7719436501142a9e182ee5",
"assets/assets/images/detail.png": "3e8494d1caa1e244c29c04bbf456511a",
"assets/assets/images/done.png": "abe67e398fb4a16914e93609cef96bed",
"assets/assets/images/next.png": "3d3b63472c47b5addcdfc4f92b66a0ff",
"assets/assets/images/o_mark.png": "0974c218965cbcdcea5fe8367b7e99cd",
"assets/assets/images/o_mark_checked.png": "8722bc2c6b2ee87f47d310b475f7196b",
"assets/assets/images/play.png": "158b7f1bd2cc4c217deafa21616165bd",
"assets/assets/images/ready.png": "f79b3a0c4a0941130e349661e7bb9aaf",
"assets/assets/images/rewind.png": "8bec80d7fd682128880e3dda5719f469",
"assets/assets/images/robot1.png": "7dda7508598ae5dd6eadbaa8b587a566",
"assets/assets/images/robot2.png": "20d4dbe8f6cbcde93b9e5557e4054b61",
"assets/assets/images/start.png": "5440c053a2a6f6624e8895320022338e",
"assets/assets/images/teacher_finish.jpg": "6600ea3b978aa4ba779a947e0f4335d6",
"assets/assets/images/teacher_notice.jpg": "29155c31a75666389e2d8efca94558d3",
"assets/assets/images/teacher_q.jpg": "3236125f2c6b7c5f6b0f7fc3477f2e77",
"assets/assets/images/teacher_q_analysis.jpg": "a3c4847420afdfb14b83fead0a2e54cd",
"assets/assets/images/teacher_q_o.jpg": "2b3a1b1592e2ff507fc1d7e4e6a85d28",
"assets/assets/images/teacher_q_x.jpg": "2acf484cdc4dc4cf0b25499299100ab5",
"assets/assets/images/x_mark.png": "d0e814432937c3e34e36ff668c2b4998",
"assets/assets/images/x_mark_checked.png": "7874df7b5baac671027838ff5e38df63",
"assets/FontManifest.json": "954c623903474e0f34d1042aa5504268",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"assets/NOTICES": "d8be6a2239ee6fa663268bf5cf2db2ce",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "dcd731149749228fd5430c2b7576f5ac",
"/": "dcd731149749228fd5430c2b7576f5ac",
"main.dart.js": "462fdf1c3f93ff9a4c5ccd79ea65511e",
"manifest.json": "079dca3646640905ea45340d3cf78b64",
"version.json": "725aaae93aaf52bcd8e2d973daa91140"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
