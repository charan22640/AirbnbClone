window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q'); // Get the search query from the URL
    
    if (query) {
        document.getElementById('search-input').value = query; // Pre-fill the search input with the existing query
    }
};