let currentSongUUID;
let prevSongUUID;
let nextSongUUID;

let songUUID = document.getElementById('songUUID');
let songUUIDBtn = document.getElementById('songUUIDBtn');

let songName = document.getElementById('songName');
let albumCover = document.getElementById('albumCover');


let prevSong = document.getElementById('prevSong');
let playPause = document.getElementById('playPause');
let nextSong = document.getElementById('nextSong');

let progress = document.getElementById('progress');
let currentTime = document.getElementById('currentTime');
let duration = document.getElementById('duration');

let mediaVolume = document.getElementById('mediaVolume');
let volumeIcon = document.getElementById('volumeIcon');

let mediaPlayer = document.getElementById('audio');
let mediaPlayerSource = document.getElementById('source');

let mediaPaused;

let songsData;

$.getJSON('app/js/songs.json', function (songsData) {

    songs = songsData;
    return songsData;
});

songUUIDBtn.addEventListener('click', () => {
    currentSongUUID = parseInt(songUUID.value);
    assemblePlayer(currentSongUUID);
});

// assemble player
function assemblePlayer(currentSongUUID) {
    $.getJSON('app/js/songs.json', function (songsData) {

        for (let i = 0; i < songsData.length; i++) {
            if (songsData[i].uuid == currentSongUUID) {
                songName.innerText = songsData[i].songName;
                albumCover.style.backgroundImage = 'url(' + songsData[i].albumCover + ')';

                prevSongUUID = currentSongUUID++;
                prevSongUUID = currentSongUUID--;


                mediaPlayerSource.src = 'res/songs/' + currentSongUUID + '.mp3';

                mediaPlayer.load();
                mediaPlayer.play();

                mediaPlayer.onloadedmetadata = function () {
                    progress.max = mediaPlayer.duration;
                    progress.currentTime = mediaPlayer.currentTime;
                }

                currentTime.innerText = '00:00';

                setInterval(updateTrackTime, 500);

                mediaPaused = false;

                playPause.innerHTML = '<i class="fa-solid fa-pause"></i>';

                return;
            }

            console.log('song requested not found.')
        }

    });
}

// prev song 

prevSong.addEventListener('click', () => {
    if (currentSongUUID > 0) {
        currentSongUUID = currentSongUUID = parseInt(currentSongUUID - 1);
        assemblePlayer(currentSongUUID);
    }
    return;
});

// play or pause song 

playPause.addEventListener('click', () => {
    if (mediaPaused == true) {
        mediaPlayer.play();
        mediaPaused = false;
        playPause.innerHTML = '<i class="fa-solid fa-pause"></i>';
        return;
    }

    mediaPlayer.pause();
    mediaPaused = true;
    playPause.innerHTML = '<i class="fa-solid fa-play"></i>';
    return;
});

// next song 

nextSong.addEventListener('click', playNext);

function playNext() {
    if (currentSongUUID < 12) {
        currentSongUUID = currentSongUUID = parseInt(currentSongUUID + 1);
        assemblePlayer(currentSongUUID);
    }
    return;
}

progress.addEventListener('change', () => {
    mediaPlayer.currentTime = progress.value;
});


// volume slider

mediaVolume.addEventListener('change', updateMediaVolume);

function updateMediaVolume() {
    mediaPlayer.volume = mediaVolume.value / 100;

    savedVolume = mediaVolume.value;

    if (mediaVolume.value > 50) {
        volumeIcon.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    } else if (mediaVolume.value > 0) {
        volumeIcon.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
    } else if (mediaVolume.value == 0) {
        volumeIcon.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    }
}

mediaPlayer.addEventListener("loadedmetadata", (event) => {
    duration.innerHTML = formatSecondsAsTime(Math.floor(mediaPlayer.duration));
});

function updateTrackTime() {
    currentTime.innerText = formatSecondsAsTime(mediaPlayer.currentTime);

    const percent = (mediaPlayer.currentTime / mediaPlayer.duration) * 100;
    progress.value = mediaPlayer.currentTime;

    if (currentTime.innerText == duration.innerText) {
        playNext();
    }
}

function formatSecondsAsTime(secs, format) {
    let hr = Math.floor(secs / 3600);
    let min = Math.floor((secs - (hr * 3600)) / 60);
    let sec = Math.floor(secs - (hr * 3600) - (min * 60));

    if (hr < 10) { hr = "0" + hr; }
    if (min < 10) { min = "0" + min; }
    if (sec < 10) { sec = "0" + sec; }
    if (hr) { hr = "00"; }

    if (format != null) {
        let formatted_time = format.replace('hh', hr);
        formatted_time = formatted_time.replace('h', hr * 1 + ""); // check for single hour formatting
        formatted_time = formatted_time.replace('mm', min);
        formatted_time = formatted_time.replace('m', min * 1 + ""); // check for single minute formatting
        formatted_time = formatted_time.replace('ss', sec);
        formatted_time = formatted_time.replace('s', sec * 1 + ""); // check for single second formatting
        return formatted_time;
    } else {
        return min + ':' + sec;
    }
}