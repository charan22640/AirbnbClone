let selectedCategories = [];

// Get categories from URL on page load
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const categoriesFromUrl = urlParams.get('categories');

  if (categoriesFromUrl) {
    selectedCategories = categoriesFromUrl.split(',');
    updateFilterAppearance();
    filterListings();
  } else {
    filterListings(); // Show all listings if no categories are selected
  }
};


// Function to toggle the filter
function toggleFilter(filterElement) {
  const category = filterElement.getAttribute('data-category');
  const index = selectedCategories.indexOf(category);

  if (index === -1) {
    selectedCategories.push(category); // Add category to selected list
  } else {
    selectedCategories.splice(index, 1); // Remove category from selected list
  }

  // Update the URL with selected categories
  const newUrl = selectedCategories.length > 0
    ? `/listings?categories=${selectedCategories.join(',')}`
    : '/listings';

  window.history.pushState(null, null, newUrl);

  updateFilterAppearance(); // Update appearance of filters
  filterListings(); // Apply filtering to listings
}

// Update the appearance of selected filters
function updateFilterAppearance() {
  const filterElements = document.querySelectorAll('#filters .filter');
  filterElements.forEach((element) => {
    const category = element.getAttribute('data-category');
    element.classList.toggle('selected', selectedCategories.includes(category));
  });
}


// Function to filter listings based on selected categories (OR logic)
function filterListings() {
  const listings = document.querySelectorAll('.listing-card');
  const container = document.querySelector('.row'); // The parent container where listings are

  // Check if categories are selected; show all if none
  if (selectedCategories.length === 0) {
    listings.forEach((listing) => {
      listing.style.display = 'block';
    });
    return;
  }

  // Filter listings based on selected categories
  const visibleListings = Array.from(listings).filter((listing) => {
    const listingCategories = listing.getAttribute('data-category').split(',');
    return selectedCategories.some((category) =>
      listingCategories.includes(category)
    );
  });

  // Show and hide listings accordingly
  listings.forEach((listing) => {
    listing.style.display = visibleListings.includes(listing) ? 'block' : 'none';
  });
}

  // Hide all listings initially
  listings.forEach(listing => {
    listing.style.display = 'none';
  });

  // Show the filtered listings in their original order
  visibleListings.forEach((listing) => {
    listing.style.display = 'block'; // Show the listing
    container.appendChild(listing); // Add the listing back to the container
  });

