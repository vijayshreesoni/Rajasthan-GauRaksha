
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
