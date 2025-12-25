const modeBtn = document.querySelector(".header-btn");
const wrapper = document.getElementById("wrapper");
const searchInput = document.querySelector(".main-input");
const regionSelect = document.querySelector("#regionSelect");

let allCountries = [];

modeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  document.body.classList.toggle("bg-gray-900");
  document.body.classList.toggle("text-white");

  const span = modeBtn.querySelector("span");
  span.textContent = document.body.classList.contains("dark")
    ? "Kunduzgi rejim chiqsin  "
    : "tungi rejim chiqsin ";
});

async function getCountries() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,capital,flags,population,region"
    );

    if (!response.ok) {
      throw new Error("Server error");
    }

    const countries = await response.json();
    allCountries = countries;

    console.log(allCountries)

    renderCountries(allCountries);

    searchInput.addEventListener("input", filterCountries);
    regionSelect.addEventListener("change", filterCountries);
  } catch (error) {
    console.error(error);
    wrapper.innerHTML = `<p class="text-red-500">❌ Failed to load data</p>`;
  }
}

function filterCountries() {
  const searchValue = searchInput.value.toLowerCase();
  const regionValue = regionSelect.value;

  let filtered = allCountries.filter((country) =>
    country.name.common.toLowerCase().includes(searchValue)
  );


  console.log(filtered)

  if (regionValue !== "all") {
    filtered = filtered.filter((country) => country.region === regionValue);
  }

  renderCountries(filtered);
}

function renderCountries(countries) {
  wrapper.innerHTML = "";

  countries.forEach((country) => {
    const card = document.createElement("div");
    card.className =
      "bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition overflow-hidden";

    card.innerHTML = `
      <img src="${country.flags.png}" class="w-full h-40 object-cover" />

      <div class="p-4">
        <h3 class="font-bold text-lg mb-2">
          ${country.name.common}
        </h3>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Capital:</strong> ${
          country.capital ? country.capital[0] : "No capital"
        }</p>
      </div>
    `;

    wrapper.appendChild(card);
  });
}

getCountries();
