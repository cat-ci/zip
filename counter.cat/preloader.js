document.addEventListener('DOMContentLoaded', () => {
  const pres = document.querySelectorAll('pre[pre-src]');
  pres.forEach(async (pre) => {
    const url = pre.getAttribute('pre-src');
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const text = await response.text();
      pre.textContent = text;
    } catch (err) {
      pre.textContent = `Failed to load: ${err.message}`;
    }
  });
});
