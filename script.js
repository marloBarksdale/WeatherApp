let weatherAPI;
let backgroundAPI;
let userLocation = "Toronto";
let image = document.querySelector("#weatherIcon");
let description = document.querySelector("#description");
let cityName = document.querySelector("#name");
let countryFlag = document.createElement("img");
let searchButton = document.querySelector("#searchButton");
let search = document.getElementById("search");
let matchList = document.getElementById("match_list");

searchButton.addEventListener("click", () => {
  if (search.value.length > 0) {
    getWeather(search.value);
  }
});

search.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    searchButton.click();
  }
});

search.addEventListener("input", () => searchCities(search.value));

const searchCities = async (searchText) => {
  const response = await fetch("data/cities.json");
  const countries = await response.json();

  let cities = [];

  for (let i in countries) {
    cities.push(countries[i]);
  }
  // console.log(cities);

  let matches = cities.filter((city) => {
    const regex = new RegExp(`^${searchText}`, "gi");

    return city.name.match(regex);
  });

  if (searchText.length === 0) {
    matches = [];
    matchList.innerHTML = "";
  }

  // console.log(matches);

  outputHtml(matches);
};

const outputHtml = async (matches) => {
  if (matches.length > 0 && matches.length < 20) {
    const html = await matches
      .map(
        (match) => `
      <div id = "match"> 
      <h4>${match.name},${match.country}</h4>
      </div>
      
      </div>
    
    `
      )
      .join("");
    matchList.innerHTML = html;
    matchList.className = "";
    let matchItems = document.querySelectorAll("#match");

    matchItems.forEach((match) => {
      match.addEventListener("click", () => {
        search.value = match.textContent.trim();
        matchList.classList.toggle("hidden");
        matchList.innerHTML = "";
        searchButton.click();
      });
    });
  }
};
//Search Cities

async function getFlag(flagCode) {
  console.log(flagCode);

  let response = await fetch(`https://restcountries.com/v3.1/alpha/CA`, {
    mode: "cors",
  });

  response = await response.json();
  // console.log(response);

  let countries = response[0];
  cityName.textContent += ", " + countries.name.common;
  countryFlag.src = countries.flags.png;
  countryFlag.style.height = "20px";
  countryFlag.style.marginLeft = "10px";

  //   countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

  cityName.appendChild(countryFlag);

  // console.log(countries);
}

async function getWeather(userLocation) {
  let response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${userLocation}&APPID=6f71b7c281918ad39373555f66cffd54`,
    { mode: "cors" }
  );

  response = await response.json();
  let icon = response.weather[0].icon;
  description.textContent = response.weather[0].description.toUpperCase();
  // console.log(response.name);
  cityName.textContent = response.name + ", " + response.sys.country;

  let imgurl = await fetch(`http://openweathermap.org/img/wn/${icon}@2x.png`, {
    mode: "cors",
  });

  image.src = imgurl.url;

  // await getFlag(response.sys.country);
}

getWeather(userLocation);
