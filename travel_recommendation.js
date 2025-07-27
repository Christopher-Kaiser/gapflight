function performSearch() {
    const query = document.getElementById("searchInput").value;
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);
            // In the future, filter and display results here
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

  function resetResults() {
    document.getElementById("searchInput").value = '';
    alert("Search reset.");
}