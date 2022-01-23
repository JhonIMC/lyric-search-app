// App Config
const API = "https://api.lyrics.ovh"

// DOM Elements
const search = document.querySelector(".search");
const form = document.querySelector(".form");
const content = document.querySelector(".content");

// Listen form submit
form.addEventListener("submit", evet => {
    evet.preventDefault();
    
    const searchTerm = search.value.trim();
    
    if (!searchTerm) {
        alert("You must type a valid search term");
        return
    }
    searchSongs(searchTerm);
})

// Search for songs or artists
async function searchSongs(search){
    const request = await fetch(`${API}/suggest/${search}`)
    const response = await request.json();
    const songs = response.data;
    
    showSongs(songs);
}

// Show fetched songs
function showSongs(songs){
    content.innerHTML = `
        <ul class="songs">
            ${songs.map(song => {
                return `<li class="song">
                            <img src="${song.artist.picture}" class"avatar">
                            <span>${song.title} by ${song.artist.name}</span>
                            <button data-title="${song.title}" data-artist="${song.artist.name}" class="show">Show Lyric</button>
                        </li>`
            }).join("")}
        </ul>
    `;
}

content.addEventListener("click", evet => {
    if (evet.target.tagName === "BUTTON") {
        const element = evet.target;
        const title = element.getAttribute("data-title");
        const artist = element.getAttribute("data-artist");

        getSong(title, artist);
    }
})

// Get song lyric
async function getSong(title, artist) {
    const request = await fetch(`${API}/v1/${artist}/${title}`)
    const response = await request.json()
    const lyric = response.lyrics
    
    showSong(title, artist, lyric)
}

// Show song lyric
function showSong(title, artist, lyric) {
    lyric = lyric.replace(/(\n\r|\n|\r)/g, "<br>")
    content.innerHTML = `
        <h1 class="title">${title} by ${artist}</h1>
        <p class="lyric">
            ${lyric}
        </p>
   `
}