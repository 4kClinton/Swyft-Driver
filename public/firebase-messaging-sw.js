self.addEventListener("push", (event) => {
  console.log("📩 Push Notification Received", event);
  const data = event.data?.json();

  if (data?.notification) {
    const { title, body, icon, click_action } = data.notification;

    const options = {
      body: body || "New notification",
      icon: icon || "/default_icon.png",
      data: { url: click_action || "/dashboard" },
    };

    event.waitUntil(self.registration.showNotification(title, options));
  }
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("🖱️ Notification Clicked:", event);
  event.notification.close();

  let urlToOpen = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === urlToOpen) {
          return client.focus();
        }
      }
      return self.clients.openWindow(urlToOpen);
    })
  );
});
