function performSearch() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const resultsDiv = document.getElementById("searchResults");
    resultsDiv.innerHTML = '';
    resultsDiv.classList.remove('active');
    if (!query) return;
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            let normalized = query.replace(/\s+/g, '');
            if (normalized.endsWith('es')) normalized = normalized.slice(0, -2);
            else if (normalized.endsWith('s')) normalized = normalized.slice(0, -1);

            function matches(str) {
                return str.toLowerCase().includes(query) ||
                       str.toLowerCase().includes(normalized);
            }

            let beaches = [], temples = [], countries = [], cities = [];

            // Search beaches
            data.beaches.forEach(beach => {
                if (matches(beach.name) || matches('beach')) beaches.push(beach);
            });

            // Search temples
            data.temples.forEach(temple => {
                if (matches(temple.name) || matches('temple')) temples.push(temple);
            });

            // Search countries and their cities
            // --- FIX: If query is 'country' or 'countries', show all countries ---
            if (normalized === 'country') {
                countries = data.countries.slice();
            } else {
                data.countries.forEach(country => {
                    if (matches(country.name)) {
                        countries.push(country);
                    }
                    country.cities.forEach(city => {
                        if (matches(city.name)) {
                            cities.push({country: country.name, ...city});
                        }
                    });
                });
            }

            // Helper to render a card
            function renderCard(item, type) {
                return `
                <div class="result-card">
                    <img src="${item.imageUrl}" alt="${item.name}" class="result-img">
                    <div class="result-info">
                        <h3 class="result-title">${item.name}</h3>
                        <p class="result-desc">${item.description || ''}</p>
                        ${type === 'City' ? `<p class='result-country'>Country: ${item.country}</p>` : ''}
                        <a href="#" class="visit-btn">Visit</a>
                    </div>
                </div>
                `;
            }

            let html = '';
            let any = false;
            if (beaches.length > 0) {
                html += `<div class="result-row">`;
                beaches.slice(0,2).forEach(beach => {
                    html += renderCard(beach, 'Beach');
                });
                html += '</div>';
                any = true;
            }
            if (temples.length > 0) {
                html += `<div class="result-row">`;
                temples.slice(0,2).forEach(temple => {
                    html += renderCard(temple, 'Temple');
                });
                html += '</div>';
                any = true;
            }
            if (countries.length > 0) {
                html += `<div class="result-row">`;
                countries.slice(0,2).forEach(country => {
                    html += renderCard({
                        name: country.name,
                        imageUrl: country.cities[0]?.imageUrl || '',
                        description: country.cities[0]?.description || ''
                    }, 'Country');
                });
                html += '</div>';
                any = true;
            }
            if (cities.length > 0) {
                html += `<div class="result-row">`;
                cities.slice(0,2).forEach(city => {
                    html += renderCard(city, 'City');
                });
                html += '</div>';
                any = true;
            }
            if (!any) {
                html = '<p>No recommendations found for your search.</p>';
            }
            resultsDiv.innerHTML = html;
            if (any) resultsDiv.classList.add('active');
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function resetResults() {
    document.getElementById("searchInput").value = '';
    const resultsDiv = document.getElementById("searchResults");
    resultsDiv.innerHTML = '';
    resultsDiv.classList.remove('active');
}