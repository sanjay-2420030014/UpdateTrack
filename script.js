// fallback data (used if fetch fails)
let latest = {
    "chrome": { "version": 120, "link": "https://www.google.com/chrome/" },
    "vscode": { "version": 1.85, "link": "https://code.visualstudio.com/" },
    "windows": { "version": 11, "link": "https://www.microsoft.com/windows" },
    "spotify": { "version": 9, "link": "https://www.spotify.com/" },
    "zoom": { "version": 6, "link": "https://zoom.us/download" }
};

// user versions (can be changed later if needed)
let userVersions = {
    "chrome": 110,
    "vscode": 1.85,
    "windows": 10,
    "spotify": 8,
    "zoom": 5
};

// 🔥 FETCH FROM GITHUB JSON

fetch("https://raw.githubusercontent.com/sanjay-2420030014/UpdateTrack/main/versions.json?t=" + new Date().getTime())
  .then(res => res.json())
  .then(data => {
      latest = data;
      displayApps();
  })
  .catch(() => {
      console.log("Using local fallback data");
  });


// DISPLAY APPS
function displayApps(filter = ""){
    let container = document.getElementById("appContainer");
    container.innerHTML = "";

    for(let app in latest){

        if(!app.toLowerCase().includes(filter.toLowerCase())) continue;

        let status = "";

        // 🔥 SAFE CHECK
        if(userVersions[app] < latest[app].version){
            status = `
                ❌ Outdated <br>
                <a href="${latest[app].link}" target="_blank">
                    <button>⬇️ Update Now</button>
                </a>
                <br><small>⚠️ Please update soon</small>
            `;
        } else {
            status = "✅ Updated";
        }

        let card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${app.toUpperCase()}</h3>
            <p>Current: ${userVersions[app]}</p>
            <p>Latest: ${latest[app].version}</p>
            <p>${status}</p>
            <button onclick="addFav('${app}')">⭐ Favorite</button>
        `;

        container.appendChild(card);
    }
}


// SEARCH
function searchApps(){
    let val = document.getElementById("search").value;
    displayApps(val);
}


// FAVORITES LOAD
function loadFavorites(){
    let fav = JSON.parse(localStorage.getItem("fav")) || [];
    let container = document.getElementById("favorites");
    container.innerHTML = "";

    fav.forEach(app => {
        let div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>${app.toUpperCase()}</h3>
            <button onclick="removeFav('${app}')">❌ Remove</button>
        `;

        container.appendChild(div);
    });
}


// ADD FAVORITE
function addFav(app){
    let fav = JSON.parse(localStorage.getItem("fav")) || [];

    if(!fav.includes(app)){
        fav.push(app);
        localStorage.setItem("fav", JSON.stringify(fav));
        loadFavorites();
    }
}


// REMOVE FAVORITE
function removeFav(app){
    let fav = JSON.parse(localStorage.getItem("fav")) || [];

    fav = fav.filter(item => item !== app);

    localStorage.setItem("fav", JSON.stringify(fav));

    loadFavorites();
}


// INITIAL LOAD
window.onload = () => {
    displayApps();
    loadFavorites();
};