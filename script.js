document.addEventListener('DOMContentLoaded', () => {
    feather.replace(); 

    const playPauseButton = document.getElementById('play-pause');
    const audio = document.getElementById('audio');
    const songDuration = document.getElementById('song-duration');
    const lyricsContainer = document.getElementById('lyrics-container');
    let intervalId;

    const lyrics = [
        { time: 0, text: "Jadi Kekasih Ku Saja" },
        { time: 0.3, text: "Jadi Kekasih Ku Saja " },
        { time: 3, text: "Cinta Katakan Cinta " },
        { time: 5, text: "Hati Ini Meminta" },
        { time: 11, text: "Kau Lebih Dari Teman Berbagi" },
        { time: 15, text: "Jadi Kekasih Ku Saja" },
        { time: 19, text: "Cinta katakan cinta "},
        { time: 21, text: "Hati ini meminta"},
        { time: 26, text: "Kau lebih dari teman berbagi"},
        { time: 31, text: "Jadi kekasihku saja" },
        { time: 34, text: "....." },
    ];

    playPauseButton.addEventListener('click', () => {
        togglePlay();
    });

    function togglePlay() {
        if (audio.paused) {
            audio.play();
            playPauseButton.innerHTML = '<i data-feather="pause"></i>'; 
            feather.replace(); 
            displayDuration(); 
            startPageTransition(); 
            syncLyrics(); 
        } else {
            audio.pause();
            playPauseButton.innerHTML = '<i data-feather="play"></i>';
            feather.replace(); 
            clearInterval(intervalId); 
            clearInterval(lyricsInterval); 
        }
    }

    function displayDuration() {
        audio.addEventListener('loadedmetadata', () => {
            const duration = formatTime(audio.duration);
            songDuration.textContent = duration; 
        });

        audio.addEventListener('timeupdate', () => {
            const currentTime = formatTime(audio.currentTime);
            const duration = formatTime(audio.duration);
            songDuration.textContent = currentTime + ' / ' + duration; 
        });
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedTime = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        return formattedTime;
    }

    function preloadImages(pages) {
        return new Promise((resolve) => {
            let loadedCount = 0;
            const totalImages = pages.length;

            pages.forEach(page => {
                const img = page.querySelector('img');
                if (img.complete) {
                    loadedCount++;
                    if (loadedCount === totalImages) resolve();
                } else {
                    img.onload = () => {
                        loadedCount++;
                        if (loadedCount === totalImages) resolve();
                    };
                }
            });
        });
    }

    const rightPages = document.querySelectorAll('.right-page');
    let currentPage = 0;

    function showPage(pageIndex) {
        rightPages.forEach((page, index) => {
            if (index === pageIndex) {
                page.style.transform = 'rotateY(0deg)';
                page.style.zIndex = 2;
                page.style.visibility = 'visible';
            } else if (index < pageIndex) {
                page.style.transform = 'rotateY(-180deg)';
                page.style.zIndex = 1;
                page.style.visibility = 'visible';
            } else {
                page.style.transform = 'rotateY(0deg)';
                page.style.zIndex = 0;
                page.style.visibility = 'visible';
            }
        });

        if (pageIndex < rightPages.length - 1) {
            rightPages[pageIndex + 1].style.transform = 'rotateY(0deg)';
            rightPages[pageIndex + 1].style.zIndex = 1;
            rightPages[pageIndex + 1].style.visibility = 'visible';
        }
    }

    function nextPage() {
        if (currentPage < rightPages.length - 1) {
            currentPage++;
        } else {
            currentPage = 0; 
        }
        showPage(currentPage);
    }

    function startPageTransition() {
        intervalId = setInterval(nextPage, 4000);
    }

    function syncLyrics() {
        const lyricsInterval = setInterval(() => {
            const currentTime = audio.currentTime;
            const currentLyric = lyrics.find(lyric => Math.floor(lyric.time) === Math.floor(currentTime));
            if (currentLyric) {
                lyricsContainer.textContent = currentLyric.text;
            }
        }, 1000);
    }

    preloadImages(rightPages).then(() => {
        showPage(currentPage);
    });
});
