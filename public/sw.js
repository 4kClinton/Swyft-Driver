self.addEventListener("push", function (event) {
  console.log("[Service Worker] Push event received.");

  if (!event.data) {
    console.log("Push event but no data");
    return;
  }

  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    console.error("Error parsing push event data:", e);
  }

  const title = data.title || "New Notification";
  const options = {
    body: data.body || "You have a new message!",
    icon: "/icon.png",
    badge: "/badge.png",
    data: { url: data.url || "/" },
    requireInteraction: true,  // Ensures the notification stays until clicked/dismissed
    actions: [{ action: "open", title: "View" }]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
