
const listContainer = document.getElementById("gaushala-list");
const searchBox = document.getElementById("searchBox");
const radiusFilter = document.getElementById("radiusFilter");

function displayGaushalas(data) {
  listContainer.innerHTML = ""; // पहले साफ करो

  data.forEach(g => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${g.name}</h3>
      <p><strong>Distance:</strong> ${g.distance} km</p>

      <a href="gaushala-details.html?id=${g.id}" class="detail-btn">
        View Details
      </a>
    `;

    listContainer.appendChild(card);
  });
}

// Initial display
displayGaushalas(gaushalas);

// ⭐ SEARCH FILTER
searchBox.addEventListener("input", () => {
  const searchText = searchBox.value.toLowerCase();

  const filtered = gaushalas.filter(g =>
    g.name.toLowerCase().includes(searchText)
  );

  displayGaushalas(filtered);
});

// ⭐ RADIUS FILTER
radiusFilter.addEventListener("change", () => {
  const value = radiusFilter.value;

  if (value === "all") {
    displayGaushalas(gaushalas);
  } else {
    const filtered = gaushalas.filter(g => g.distance <= Number(value));
    displayGaushalas(filtered);
  }
});
