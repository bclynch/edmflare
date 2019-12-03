(function () {
  'use strict';
  
  self.addEventListener('notificationclick', (event) => {
    console.log('notification details: ', event);
    event.notification.close();
    console.log('notification details: ', event.notification);
    if (clients.openWindow && event.notification.data.url) {
      event.waitUntil(clients.openWindow(event.notification.data.url));
    }
  });
}());