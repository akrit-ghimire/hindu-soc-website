importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js')
importScripts('/assets/scripts/modal.js')
importScripts('/assets/scripts/reminders.js')
importScripts('/assets/scripts/load_events.js')

if (!workbox) throw new Error("Workbox doesnt exist.")

// Precache files
workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/events.html', revision: '1' },
    { url: '/socials.html', revision: '1' },
    { url: '/contact.html', revision: '1' },
]);

// Cache CSS and JS files
workbox.routing.registerRoute(
    ({ request }) => request.destination === 'style' || request.destination === 'script',
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'static-resources',
    })
);

// Cache images
workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 100, // maximum to store
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    })
);

workbox.routing.registerRoute(
    new RegExp('^https://fonts\.googleapis\.com/css2\?family=League\+Spartan:wght@100..900&display=swap'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
)

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/events.html')
    );
});

self.addEventListener('message', event => {
    if (Notification.permission !== 'granted') return

    if (event.data && event.data.type === 'notify') {
      const data = event.data.payload
  
      const title = data.title
    
      const options = {
        body: data.text,
        icon: '/assets/icons/favicon-196.png',
      }
  
      self.registration.showNotification(title, options)
    }
  })

self.addEventListener('push', (event) => {
    const instruction = event.data.text()

    if (instruction == 'remind') remind()
    else if (instruction == 'new') new_event()
})