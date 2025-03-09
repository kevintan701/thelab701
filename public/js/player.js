// Music Player for THE.LAB.701
// This module handles the mini music player functionality

const playlist = [
    {
        name: "Enjoy Your Cozy Morning",
        youtubeId: "r3GcGPr5Bxk",
        thumbnail: "medias/Cover-M1.png"
    },
    {
        name: "Your Fresh Groove",
        youtubeId: "QelOR3Yf3mI",
        thumbnail: "medias/Cover-M2.png"
    },
    {
        name: "A new Start, A new Space",
        youtubeId: "DTfYN61kmS8",
        thumbnail: "medias/Cover-M3.png"
    },
    {
        name: "6 AM",
        youtubeId: "kGnc77jVGyY",
        thumbnail: "medias/Cover-M4.png"
    }
];

let currentTrackIndex = 0;
let isPlaying = false;
let player = null;

// Initialize YouTube IFrame API
function initYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Called automatically by YouTube API when ready
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: playlist[currentTrackIndex].youtubeId,
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'disablekb': 1,
            'modestbranding': 1,
            'rel': 0,
            'showinfo': 0,
            'fs': 0
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
};

// Handle player state changes
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        playNext();
    }
    updatePlayPauseButton();
}

// Update the play/pause button appearance
function updatePlayPauseButton() {
    const playPauseBtn = document.querySelector('#play-pause');
    if (!playPauseBtn) return;

    if (player && player.getPlayerState() === YT.PlayerState.PLAYING) {
        playPauseBtn.textContent = 'pause_circle';
        isPlaying = true;
    } else {
        playPauseBtn.textContent = 'play_circle';
        isPlaying = false;
    }
}

// Toggle play/pause
function togglePlay() {
    if (!player) return;

    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
    isPlaying = !isPlaying;
    updatePlayPauseButton();
}

// Play next track
function playNext() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadAndPlayTrack();
}

// Play previous track
function playPrevious() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadAndPlayTrack();
}

// Load and play the current track
function loadAndPlayTrack() {
    const track = playlist[currentTrackIndex];
    player.loadVideoById(track.youtubeId);
    updateTrackInfo();
}

// Update track information display
function updateTrackInfo() {
    const track = playlist[currentTrackIndex];
    const trackName = document.querySelector('#track-name');
    const thumbnail = document.querySelector('#track-thumbnail');
    
    if (trackName) trackName.textContent = track.name;
    if (thumbnail) thumbnail.src = track.thumbnail;
}

// Initialize the player when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initYouTubeAPI();
    updateTrackInfo();

    // Add event listeners for controls
    document.querySelector('#play-pause')?.addEventListener('click', togglePlay);
    document.querySelector('#next-track')?.addEventListener('click', playNext);
    document.querySelector('#prev-track')?.addEventListener('click', playPrevious);
}); 