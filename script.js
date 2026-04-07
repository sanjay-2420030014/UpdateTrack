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
      displayApps(); 
  });


// DISPLAY APPS
function displayApps(filter = ""){
    let container = document.getElementById("appContainer");
    container.innerHTML = "";
    let delayIndex = 0;

    for(let app in latest){

        if(!app.toLowerCase().includes(filter.toLowerCase())) continue;

        let status = "";

        // 🔥 SAFE CHECK
        let isOutdated = userVersions[app] < latest[app].version;
        if(isOutdated){
            status = `
                <div class="status outdated pulse-warning">
                    <span class="status-badge glow-red">❌ Outdated</span>
                    <a href="${latest[app].link}" target="_blank" class="update-link">
                        <button class="btn primary-btn shine-effect">⬇️ Update Now</button>
                    </a>
                    <small class="warning-text">⚠️ Please update soon</small>
                </div>
            `;
        } else {
            status = `<div class="status updated"><span class="status-badge glow-green">✅ Up to date</span></div>`;
        }

        let card = document.createElement("div");
        card.className = "card fade-in-up";
        card.style.animationDelay = `${delayIndex * 0.1}s`;
        
        // Show current version safely to match original behavior
        let displayUserVersion = userVersions[app] !== undefined ? userVersions[app] : "Unknown";
        let currentClass = isOutdated ? "text-outdated" : "text-updated";

        card.innerHTML = `
            <div class="card-header">
                <h3>${app.toUpperCase()}</h3>
                <button class="icon-btn fav-btn star-click" onclick="addFav('${app}')" title="Add to Favorites">⭐</button>
            </div>
            <div class="card-body">
                <div class="version-info">
                    <div class="version-box">
                        <span class="label">Current Version (Installed)</span>
                        <span class="helper">Installed on system</span>
                        <span class="value ${currentClass}">${displayUserVersion}</span>
                    </div>
                    <div class="version-divider">
                        <span class="arrow">${isOutdated ? '➡️' : '✔️'}</span>
                    </div>
                    <div class="version-box align-right">
                        <span class="label">Latest Version Available</span>
                        <span class="helper">Newest version released</span>
                        <span class="value text-latest">${latest[app].version}</span>
                    </div>
                </div>
                ${status}
            </div>
        `;

        container.appendChild(card);
        delayIndex++;
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

    fav.forEach((app, index) => {
        let div = document.createElement("div");
        div.className = "card fade-in-up";
        div.style.animationDelay = `${index * 0.15}s`;

        div.innerHTML = `
            <div class="card-header">
                <h3>${app.toUpperCase()}</h3>
                <button class="icon-btn remove-btn star-click" onclick="removeFav('${app}')" title="Remove">❌</button>
            </div>
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
