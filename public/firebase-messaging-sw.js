importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

self.addEventListener("install", (event) => {
  self.skipWaiting(); // Activate immediately
});

self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker Activated");
  return self.clients.claim(); // Ensure service worker takes control immediately
});

// 🔄 Function to Fetch Firebase Config
async function getFirebaseConfig() {
  try {
    const response = await fetch("https://swyft-backend-client-nine.vercel.app/firebase-config",{
      method:"GET",
      headers:{
        
      }
    });
    if (!response.ok) throw new Error("Failed to fetch Firebase config");

    const config = await response.json();
    console.log("✅ Firebase config loaded:", config);

    return config;
  } catch (error) {
    console.error("❌ Failed to load Firebase config:", error);
    return null;
  }
}

// 🔥 Initialize Firebase & Messaging
async function initializeFirebase() {
  const config = await getFirebaseConfig();
  if (!config) return;

  firebase.initializeApp(config);
  const messaging = firebase.messaging();

  // ✅ Ensure messages are handled only when Firebase is ready
  messaging.onBackgroundMessage((payload) => {
    console.log("📩 Background Message:", payload);
    if (!payload.notification) return;

    const { title, body, icon, click_action } = payload.notification;

    const notificationOptions = {
      body: body || "New Notification",
      icon: icon || "/default_icon.png",
      data: { url: click_action || "/" },
    };

    self.registration.showNotification(title, notificationOptions);
  });

  console.log("🚀 Firebase & Messaging initialized.");
}

// 🔄 Handle Push Subscription Changes
self.addEventListener("pushsubscriptionchange", async (event) => {
  console.log("🔄 Push Subscription Changed:", event);

  event.waitUntil(
    self.registration.pushManager.getSubscription()
      .then((oldSubscription) => {
        if (oldSubscription) {
          console.log("📭 Removing old subscription:", oldSubscription.endpoint);
          return fetch("https://your-backend.com/remove-subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subscription: oldSubscription }),
          });
        }
      })
      .then(() => self.registration.pushManager.subscribe({ userVisibleOnly: true }))
      .then((newSubscription) => {
        console.log("📬 New Subscription:", newSubscription);

        return fetch("https://your-backend.com/update-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription: newSubscription }),
        });
      })
      .catch((error) => console.error("❌ Subscription update failed:", error))
  );
});

// 🖱️ Handle Notification Click
self.addEventListener("notificationclick", (event) => {
  console.log("🖱️ Notification Click Received:", event);
  event.notification.close();

  let urlToOpen = event.notification.data?.url || "/";
  if (!urlToOpen.startsWith("http")) {
    urlToOpen = self.location.origin + urlToOpen;
  }

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const windowClient of windowClients) {
        if (windowClient.url === urlToOpen) {
          return windowClient.focus();
        }
      }
      return self.clients.openWindow(urlToOpen);
    })
  );
});

// 🚀 Initialize Firebase After Activation
initializeFirebase();
