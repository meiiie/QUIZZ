import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

async function enableMocking() {
  // Enable MSW in both DEV and production for standalone mode
  // Also enable when running in Host Shell (port 5173) or standalone (port 5003)
  if (import.meta.env.DEV || window.location.port === '5003' || window.location.port === '5173') {
    const { worker } = await import("./mocks/browser");
    await worker.start({
      serviceWorker: { url: "/mockServiceWorker.js" }, // file này phải nằm ở /public
      onUnhandledRequest: "warn", // chỉ cảnh báo thay vì error
    });
    console.log("✅ MSW worker started for port:", window.location.port);
  }
}

enableMocking().then(async () => {
  // ❗ Import App SAU khi MSW đã start
  const { default: App } = await import("./App");

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
