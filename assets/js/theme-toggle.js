document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const toggleIcon = document.getElementById("theme-toggle-icon");

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  toggleIcon.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
});