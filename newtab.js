const GEOCITIES_BASE_URL = 'https://geocities.restorativland.org';
const CHUNK_COUNT = 28; // 0 to 27

const loadingMessages = [
    "Wandering through the digital arcades of Geocities...",
    "Discovering forgotten web treasures...",
    "Exploring the digital ruins of the early web...",
    "Taking a stroll through the Geocities neighborhoods...",
    "Unearthing digital artifacts from the past..."
];

let currentChunkData = [];

async function decompressGzip(response) {
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = async (event) => {
            try {
                const ds = new DecompressionStream('gzip');
                const decompressedStream = new Blob([event.target.result])
                    .stream()
                    .pipeThrough(ds);
                const decompressedBlob = await new Response(decompressedStream).blob();
                const text = await decompressedBlob.text();
                const data = JSON.parse(text);
                resolve(data);
            } catch (error) {
                console.error('Decompression error:', error);
                reject(error);
            }
        };
        fileReader.readAsArrayBuffer(blob);
    });
}

async function loadRandomChunk() {
    try {
        const chunkNumber = Math.floor(Math.random() * CHUNK_COUNT);
        const response = await fetch(`data/geocities_flattened_chunk_${chunkNumber}.json.gz`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await decompressGzip(response);
        
        // The data structure might be different, let's check what we have
        if (!data || !Array.isArray(data)) {
            throw new Error('Invalid data format received');
        }
        
        currentChunkData = data;
    } catch (error) {
        console.error('Error loading Geocities chunk:', error);
        currentChunkData = []; // Reset to empty array on error
        throw error;
    }
}

function updateLoadingMessage() {
    const loading = document.getElementById('loading');
    loading.textContent = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
}

function getNeighborhoodDisplay(source) {
    const label = source.t === 'h' ? 'Neighborhood' : 'Suburb';
    if (source.t === 'h') {
        return `${label}: ${source.h}`;
    } else {
        return `${label}: ${source.h}/${source.b}`;
    }
}

async function getRandomPage() {
    try {
        // If no data, load a new chunk
        if (!currentChunkData || currentChunkData.length === 0) {
            document.getElementById('loading').textContent = 'Loading Geocities data...';
            await loadRandomChunk();
        }

        if (!currentChunkData || currentChunkData.length === 0) {
            throw new Error('Failed to load valid data');
        }

        const randomPage = currentChunkData[Math.floor(Math.random() * currentChunkData.length)];
        const pageUrl = `${GEOCITIES_BASE_URL}/${randomPage.url}`;
        
        // Update the iframe src
        document.getElementById('geocities-frame').src = pageUrl;
        
        // Clear previous pages
        const pagesContainer = document.getElementById('pages');
        if (pagesContainer) {
            pagesContainer.innerHTML = '';
        }
        
        // Display the new page
        displayPage(randomPage);
            
        document.getElementById('loading').style.display = 'none';
        
    } catch (error) {
        console.error('Error loading Geocities page:', error);
        document.getElementById('loading').textContent = 'Error loading page. Click Next City to try again.';
        currentChunkData = []; // Reset on error
    }
}

function displayPage(page) {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page';

    const title = document.createElement('h2');
    title.textContent = page.title;
    pageDiv.appendChild(title);

    const url = document.createElement('a');
    url.href = `${GEOCITIES_BASE_URL}/${page.url}`;
    url.target = '_blank';
    url.textContent = page.url;
    url.style.cssText = `
        color: #ffd700;
        text-decoration: none;
        font-family: "Comic Sans MS", cursive;
        text-shadow: 1px 1px #000;
    `;
    url.addEventListener('mouseover', () => {
        url.style.textDecoration = 'underline';
    });
    url.addEventListener('mouseout', () => {
        url.style.textDecoration = 'none';
    });
    pageDiv.appendChild(url);

    const neighborhood = document.createElement('p');
    neighborhood.textContent = getNeighborhoodDisplay(page.source);
    pageDiv.appendChild(neighborhood);

    if (page.last_modified) {
        const lastModified = document.createElement('p');
        lastModified.textContent = `Last modified: ${new Date(page.last_modified).toLocaleDateString()}`;
        pageDiv.appendChild(lastModified);
    }

    document.getElementById('pages').appendChild(pageDiv);
}

// Load data and initialize when the new tab opens
document.addEventListener('DOMContentLoaded', async () => {
    updateLoadingMessage();
    getRandomPage(); // This will load a random chunk and then get a random page

    // Update click handler to potentially load a new chunk
    document.getElementById('next-city').addEventListener('click', async () => {
        document.getElementById('loading').style.display = 'block';
        updateLoadingMessage();
        
        // Randomly decide whether to load a new chunk (20% chance)
        if (Math.random() < 0.2) {
            currentChunkData = [];
        }
        
        getRandomPage();
    });

    // About popup functionality
    const aboutLink = document.getElementById('about-link');
    const aboutPopup = document.getElementById('about-popup');
    const closeAbout = document.getElementById('close-about');

    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        aboutPopup.style.display = 'block';
    });

    closeAbout.addEventListener('click', () => {
        aboutPopup.style.display = 'none';
    });

    // Close popup when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === aboutPopup) {
            aboutPopup.style.display = 'none';
        }
    });
});