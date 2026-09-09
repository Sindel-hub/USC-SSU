import { callPublicEmailAction } from "./email-api.js";

const form = document.getElementById("recoveryForm");
const input = document.getElementById("recoveryGmail");
const button = document.getElementById("recoveryButton");
const status = document.getElementById("recoveryStatus");
const statusIcon = status?.querySelector(".status-icon");
const statusTitle = status?.querySelector("strong");
const statusText = document.getElementById("recoveryStatusText");

function setStatus(kind, title, message, icon) {
  status?.classList.remove("success", "error");
  if (kind) status?.classList.add(kind);
  if (statusTitle) statusTitle.textContent = title;
  if (statusText) statusText.textContent = message;
  if (statusIcon) statusIcon.textContent = icon;
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const gmail = String(input?.value || "").trim();
  if (!gmail) return;
  if (button) {
    button.disabled = true;
    button.textContent = "Sending…";
  }
  setStatus("", "Checking recovery settings", "Please wait while the request is processed.", "…");
  try {
    const result = await callPublicEmailAction("recover", { gmail });
    setStatus("success", "Check your Gmail", result.message || "If this Gmail is eligible, a password-reset message has been sent.", "✓");
    if (form) form.reset();
  } catch (error) {
    setStatus("error", "Recovery request failed", error?.message || "The email service could not process this request.", "!");
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "Send password reset link";
    }
  }
});
