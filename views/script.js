document.addEventListener('DOMContentLoaded', () => {
  const navigationLinks = document.querySelectorAll('.nav-button');
  const pageContent = document.getElementById('page-content');

  navigationLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const pageUrl = link.getAttribute('href');

      // Load content from the selected page URL
      fetch(pageUrl)
        .then((response) => response.text())
        .then((content) => {
          pageContent.innerHTML = content;
        })
        .catch((error) => console.error(error));
    });
  });
});
