function performSearch() {
    const query = document.getElementById("searchInput").value;
    alert("Searching for: " + query);
}

  function resetResults() {
    document.getElementById("searchInput").value = '';
    alert("Search reset.");
}