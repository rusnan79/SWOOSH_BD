document.addEventListener('DOMContentLoaded', function () {
  // Get all brand links
  const brandLinks = document.querySelectorAll('.brand-link');
  
  // Get all gallery sections
  const galleries = document.querySelectorAll('.gallery');
  
  // Function to hide all galleries
  function hideAllGalleries() {
      galleries.forEach(gallery => {
          gallery.classList.remove('active');
      });
  }
  
  // Add event listeners to each brand link
  brandLinks.forEach(link => {
      link.addEventListener('click', function (event) {
          event.preventDefault();
          
          // Hide all galleries before showing the selected one
          hideAllGalleries();
          
          // Get the target gallery ID from the link's href
          const targetGalleryId = this.getAttribute('href');
          const targetGallery = document.querySelector(targetGalleryId);
          
          // Show the corresponding gallery by adding the 'active' class
          if (targetGallery) {
              targetGallery.classList.add('active');
          }
      });
  });
});
