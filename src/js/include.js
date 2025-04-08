export async function includeHTML(path, elementId) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`Failed to load ${path}`);
      const html = await res.text();
      document.getElementById(elementId).innerHTML = html;
    } catch (err) {
      console.error(`includeHTML error for ${path}:`, err);
    }
  }
  