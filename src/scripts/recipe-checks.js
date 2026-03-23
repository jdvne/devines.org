// Persists recipe checkbox state to localStorage so progress survives page reloads.
const STORAGE_KEY = `recipe-checks-${window.location.pathname}`;

function saveChecks() {
  const checks = {};
  document.querySelectorAll('input[type="checkbox"]').forEach((cb, i) => {
    checks[i] = cb.checked;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
}

function loadChecks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  try {
    const checks = JSON.parse(saved);
    document.querySelectorAll('input[type="checkbox"]').forEach((cb, i) => {
      cb.checked = checks[i] ?? false;
    });
  } catch {}
}

document.addEventListener('DOMContentLoaded', () => {
  loadChecks();
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', saveChecks);
  });
});
