// 1. Global variables to hold data and the search engine
let experts = [];
let fuse;

// 2. Load data from the JSON
fetch('./data/experts.json')
    .then(response => response.json())
    .then(data => {
        experts = data;

        // 3. Initialise Fuse.js for full-text search
        const options = {
            keys: [
                { name: 'Name', weight: 0.1 },
                { name: 'Email', weight: 0.1 },
                { name: 'Role', weight: 0.3 },
                { name: 'Organisation', weight: 0.3 },
                { name: 'Location', weight: 0.3 },  
                { name: 'HRC', weight: 0.4 },
                { name: 'Clinical Expertise', weight: 0.5 },
                { name: 'Methods Expertise', weight: 0.5 },
                { name: 'Bio', weight: 0.7 }
            ],
            threshold: 0.3,
            includeScore: true
        };

        fuse = new Fuse(experts, options);

        // Initially displays all HRC experts
        displayResults(experts);
    })
    .catch(err => console.error("Error loading expert data:", err));

// 4. The search function
function handleSearch() {
    const query = document.getElementById('searchBar').value;

    if (query.length < 2) {
        displayResults(experts); // Displays everyone if search is empty
        return;
    }

    const results = fuse.search(query);
    const filteredExperts = results.map(result => result.item);
    displayResults(filteredExperts);
}

// 5. The summary statistics function
function updateStats(data) {
    const totalCount = data.length;
    const uniqueHRCs = [...new Set(data.map(expert => expert.HRC))].length;

    const statsBar = document.getElementById('stats-bar');
    if (statsBar) {
        statsBar.innerHTML = `Showing <strong>${totalCount}</strong> experts across <strong>${uniqueHRCs}</strong> HRCs`;
    }
}

// 6. Display the results in HTML
function displayResults(data) {
    const container = document.getElementById('results');
    container.innerHTML = '';

    // | CALL STATS UPDATE |
    updateStats(data);

    data.forEach(expert => {
        const card = document.createElement('div');
        card.className = 'expert-card';
        card.innerHTML = `
        <div class="card-header">
            <h3>${expert.Name}</h3>
            <p class="role-badge"><strong>${expert.Role || 'Expert'}</strong></p>
        </div>
        
        <div class="meta-info">
            <p><strong>HRC:</strong> ${expert.HRC}</p>
            <p><strong>Org:</strong> ${expert.Organisation} (${expert.Location})</p>
        </div>

        <p class="email-row">
            <strong>Email:</strong> 
            <a href="mailto:${expert.Email}" class="email-link">${expert.Email}</a>
        </p>

        <p><strong>Bio:</strong> ${expert.Bio || 'No biography available.'}</p>
        
        <div class="card-actions">
            <button class="email-btn" onclick="copyEmail('${expert.Email}')">Copy Email</button>
        </div>
    `;
        container.appendChild(card);
    });
}

// 7. Batch copying emails function
function copyEmail(email) {
    navigator.clipboard.writeText(email);
    alert('Email copied: ' + email);
}

// 8. Add Event Listener to Search Bar
document.getElementById('searchBar').addEventListener('input', handleSearch);