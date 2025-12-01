
// Mobile menu toggle
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navMenu = document.getElementById("navMenu");

hamburgerBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// -------------------------------
//      MAIN SEARCH FUNCTION
// -------------------------------
function showResults(locationText, radius) {
    const container = document.getElementById("results");
    container.innerHTML = ""; // Clear old results

    locationText = locationText.toLowerCase();   // Convert input to lowercase
    radius = parseInt(radius);                   // Convert radius to number

    // ---- Dummy Data ----
    const gaushalas = [
        { name: "Gokul Gaushala", distance: 2, cows: 120, calves: 40, space: "Available", address: "Nokha Road, Bikaner" },
        { name: "Shree Krishna Gaushala", distance: 6, cows: 80, calves: 20, space: "Full", address: "Lalgarh, Bikaner" },
        { name: "Karni Mata Gaushala", distance: 9, cows: 150, calves: 60, space: "Available", address: "Deshnok Road" }
    ];

    // FILTER — based on both text + distance
    const filtered = gaushalas.filter(g => {
        const matchText =
            g.name.toLowerCase().includes(locationText) ||
            g.address.toLowerCase().includes(locationText) ||
            locationText === "";  // if empty show all

        const matchDistance = g.distance <= radius;

        return matchText && matchDistance;
    });

    // If nothing found
    if (filtered.length === 0) {
        container.innerHTML = "<p>No gaushalas found matching your search.</p>";
        return;
    }

    // OUTPUT CARDS
    filtered.forEach(g => {
        const card = document.createElement("div");
        card.className = "result-card";

        card.innerHTML = `
            <h3>${g.name}</h3>
            <p><strong>Distance:</strong> ${g.distance} km</p>
            <p><strong>Cows:</strong> ${g.cows}</p>
            <p><strong>Calves:</strong> ${g.calves}</p>
            <p><strong>Space:</strong> ${g.space}</p>
            <p><strong>Address:</strong> ${g.address}</p>
        `;

        container.appendChild(card);
    });
}
// ------ Dummy Gaushala Data with Exact Coordinates ------
const gaushalas = [
  {
    name: "Shree Gopal Gaushala",
    area: "Bikaner",
    lat: 28.0229,
    lon: 73.3119
  },
  {
    name: "Nokha Gaushala",
    area: "Nokha",
    lat: 27.8333,
    lon: 73.5167
  },
  {
    name: "Lunkaransar Gaushala",
    area: "Lunkaransar",
    lat: 28.64,
    lon: 73.78
  }
];

// --------- Convert User Input Location to Coordinates ----------
async function getCoordinates(locationText) {
  const apiKey = "5c137a07f7d449f7a73552c2b93ecb38h";

  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(locationText)}&key=${apiKey}`
  );

  const data = await response.json();

  if (data.results.length === 0) return null;

  return {
    lat: data.results[0].geometry.lat,
    lon: data.results[0].geometry.lng,
  };
}

// ------ Haversine Distance Formula ------
function distance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// ------ Show Results ------
async function showResults(locationText, radius) {
  const container = document.getElementById("results");
  container.innerHTML = "<p>Searching...</p>";

  // Convert text location → coordinates
  const userLocation = await getCoordinates(locationText);

  if (!userLocation) {
    container.innerHTML = "<p class='muted'>Location not found.</p>";
    return;
  }

  const filtered = gaushalas.filter((g) => {
    const d = distance(userLocation.lat, userLocation.lon, g.lat, g.lon);
    return d <= radius;
  });

  if (filtered.length === 0) {
    container.innerHTML = "<p>No Gaushala found in selected radius.</p>";
    return;
  }

  container.innerHTML = filtered
    .map(
      (g) => `
      <div class="result-card">
        <h3>${g.name}</h3>
        <p>Area: ${g.area}</p>
      </div>`
    )
    .join("");
}

// ------ GPS Location ------
document.getElementById("findLocationBtn").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      // Radius selected
      const radius = document.querySelector('input[name="radius"]:checked').value;

      // Filter gaushalas
      const filtered = gaushalas.filter((g) => {
        return distance(lat, lon, g.lat, g.lon) <= radius;
      });

      const container = document.getElementById("results");

      container.innerHTML = filtered
        .map(
          (g) => `
        <div class="result-card">
          <h3>${g.name}</h3>
          <p>Area: ${g.area}</p>
        </div>`
        )
        .join("");
    },
    () => alert("Location permission denied.")
  );
});