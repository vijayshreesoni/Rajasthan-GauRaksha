// Mobile menu toggle
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navMenu = document.getElementById("navMenu");

hamburgerBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

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
  const apiKey = "5c137a07f7d449f7a73552c2b93ecb38";

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

      const radius = document.querySelector('input[name="radius"]:checked').value;

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