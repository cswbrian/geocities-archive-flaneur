const GEOCITIES_BASE_URL = 'https://geocities.restorativland.org';

const neighborhoods = [
    'Area51', 'Athens', 'Augusta', 'Bourbon', 'Broadway', 'CapeCanaveral',
    'Capitol', 'CollegePark', 'Eureka', 'Fashion', 'Heartland', 'Hollywood',
    'HotSprings', 'MadisonAvenue', 'MotorCity', 'Nashville', 'Paris',
    'Pentagon', 'Pipeline', 'RainForest', 'ResearchTriangle', 'SiliconValley',
    'SoHo', 'SouthBeach', 'Sunsetstrip', 'Television', 'TimesSquare', 'Tokyo',
    'Vienna', 'WallStreet', 'Wellesley', 'WestHollywood', 'Yosemite'
];

const subdivisions = [
    'Atlantis', 'Cave', 'Crater', 'Dunes', 'Forest', 
    'Grove', 'Haven', 'Hills', 'Hollow', 'Isle', 
    'Lake', 'Landing', 'Meadow', 'Mesa', 'Mountain', 
    'Oasis', 'Park', 'Peak', 'Plains', 'Port', 
    'Ridge', 'Shore', 'Springs', 'Valley', 'Vista'
];

const loadingMessages = [
    "Wandering through the digital arcades of Geocities...",
    "Discovering forgotten web treasures...",
    "Exploring the digital ruins of the early web...",
    "Taking a stroll through the Geocities neighborhoods...",
    "Unearthing digital artifacts from the past..."
];

function updateLoadingMessage() {
    const loading = document.getElementById('loading');
    loading.textContent = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
}

async function getRandomPage() {
    const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
    const subdivision = subdivisions[Math.floor(Math.random() * subdivisions.length)];
    
    try {
        // Generate a random number for the user directory
        const userNumber = Math.floor(Math.random() * 9999);
        const pageUrl = `${GEOCITIES_BASE_URL}/${neighborhood}/${subdivision}/${userNumber}`;
        
        // Update the iframe src
        document.getElementById('geocities-frame').src = pageUrl;
        document.getElementById('neighborhood').textContent = `Neighborhood: ${neighborhood}/${subdivision}`;
        document.getElementById('loading').style.display = 'none';
        
    } catch (error) {
        console.error('Error loading Geocities page:', error);
        document.getElementById('loading').textContent = 'Error loading page. Click Next City to try again.';
    }
}

// Load a random page when the new tab opens
document.addEventListener('DOMContentLoaded', () => {
    updateLoadingMessage();
    getRandomPage();

    // Move the button event listener here
    document.getElementById('next-city').addEventListener('click', () => {
        document.getElementById('loading').style.display = 'block';
        updateLoadingMessage();
        getRandomPage();
    });
}); 