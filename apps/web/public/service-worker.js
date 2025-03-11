const CACHE_NAME = 'my-app-cache-v2'; // Change the version number

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        // List of files to cache
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("push", (event) => {
  const data = event.data.json();
  const notification = data.notification;
  const title = notification.title;
  const body = notification.body;
  const icon = notification.icon;
  const url = notification.url;

  const notificationOptions = {
    body: body,
    tag: "unique-tag", // Use a unique tag to prevent duplicate notifications
    icon: icon,
    data: {
      url: url, // Replace with the desired URL for redirecting user to the desired page
    },
  };

  self.registration.showNotification(title, notificationOptions);
});
