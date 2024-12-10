const urlParams = new URLSearchParams(window.location.search);
const albumName = urlParams.get('data')?.toUpperCase();

let albumData;
let currentTrackIndex = 0;
const audioPlayer = document.getElementById('audio-player');
const playButton = document.querySelector('.control-btn .fa-circle-play');
const previousButton = document.querySelector('.control-btn .fa-backward-step');
const nextButton = document.querySelector('.control-btn .fa-forward-step');
const seekBar = document.querySelector('.seek-bar');
audioPlayer.volume = 0.03;

const savedState = JSON.parse(localStorage.getItem('audioState'));

if (savedState) {
  currentTrackIndex = savedState.trackIndex || 0;
  audioPlayer.src = savedState.trackSrc || '';
  audioPlayer.currentTime = savedState.currentTime || 0;
  document.querySelector('.footer-music-title').textContent = savedState.trackTitle || 'Music Title';
  document.querySelector('.footer-album-title').textContent = savedState.albumTitle || 'Album Title';
  document.querySelector('.footer-album-img').src = savedState.albumImage || '';

  if (savedState.isPlaying) {
    audioPlayer.play();
    playButton.classList.remove('fa-circle-play');
    playButton.classList.add('fa-circle-pause');
  }
}

fetch('albumData.json')
  .then(response => {
    return response.json();
  })
  .then(data => {
    const album = data[albumName];
    if (album) {
      albumData = album;
      loadAlbum(album);
      restoreUIState();
    } else {
      console.error('앨범을 찾을 수 없습니다.');
    }
  })
  .catch(error => {
    console.error('오류 발생:', error);
  });

function loadAlbum(album) {
  document.querySelector('.albumTitle').textContent = album.title;
  document.querySelector('.albumImage').src = album.image;

  const musicsContainer = document.querySelector('.musics');
  musicsContainer.innerHTML = '';

  album.audioFiles.forEach((file, index) => {
    const musicItem = document.createElement('div');
    musicItem.className = 'music';
    musicItem.textContent = album.titles[index];

    musicItem.addEventListener('click', () => {
      currentTrackIndex = index;
      updateAudioPlayer(album, index);
      audioPlayer.play();
    });

    musicsContainer.appendChild(musicItem);
  });

  const playAlbumButton = document.querySelector('.play-album-btn');
  playAlbumButton.addEventListener('click', () => {
    currentTrackIndex = 0;
    updateAudioPlayer(album, currentTrackIndex);
    playButton.classList.add('fa-circle-pause');
    audioPlayer.play();
  });

  ['.albumTitle', '.albumDescription', '.music'].forEach(selector => {
    applyFontStylesToMixedText(selector);
  });
}

function restoreUIState() {
  if (!savedState) return;

  const allMusicItems = document.querySelectorAll('.music');
  allMusicItems.forEach((item, index) => {
    if (index === savedState.trackIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function updateAudioPlayer(album, index) {
  audioPlayer.src = album.audioFiles[index];
  document.querySelector('.footer-music-title').textContent = album.titles[index];
  document.querySelector('.footer-album-title').textContent = album.title;
  document.querySelector('.footer-album-img').src = album.image;

  const allMusicItems = document.querySelectorAll('.music');
  allMusicItems.forEach((item, i) => {
    if (i === index) {
      item.classList.add('playing');
    } else {
      item.classList.remove('playing');
    }
  });

  saveAudioState(album, index);
}

function saveAudioState(album = albumData, index = currentTrackIndex) {
  localStorage.setItem('audioState', JSON.stringify({
    trackIndex: index,
    trackSrc: album.audioFiles[index],
    trackTitle: album.titles[index],
    albumTitle: album.title,
    albumImage: album.image,
    currentTime: audioPlayer.currentTime,
    isPlaying: !audioPlayer.paused
  }));
}

playButton.addEventListener('click', () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playButton.classList.remove('fa-circle-play');
    playButton.classList.add('fa-circle-pause');
  } else {
    audioPlayer.pause();
    playButton.classList.remove('fa-circle-pause');
    playButton.classList.add('fa-circle-play');
  }
  saveAudioState();
});

previousButton.addEventListener('click', () => {
  if (currentTrackIndex > 0) {
    currentTrackIndex--;
  } else {
    currentTrackIndex = albumData.audioFiles.length - 1;
  }
  updateAudioPlayer(albumData, currentTrackIndex);
  audioPlayer.play();
  playButton.classList.add('fa-circle-pause');
  playButton.classList.remove('fa-circle-play');
});

nextButton.addEventListener('click', () => {
  if (currentTrackIndex < albumData.audioFiles.length - 1) {
    currentTrackIndex++;
  } else {
    currentTrackIndex = 0;
  }
  updateAudioPlayer(albumData, currentTrackIndex);
  audioPlayer.play();
  playButton.classList.add('fa-circle-pause');
  playButton.classList.remove('fa-circle-play');
});

audioPlayer.addEventListener('ended', () => {
  if (currentTrackIndex < albumData.audioFiles.length - 1) {
    currentTrackIndex++;
  } else {
    currentTrackIndex = 0;
  }
  updateAudioPlayer(albumData, currentTrackIndex);
  audioPlayer.play();
});

audioPlayer.addEventListener('timeupdate', () => {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  seekBar.value = progress;
  saveAudioState();
});

seekBar.addEventListener('input', () => {
  const seekTo = (seekBar.value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = seekTo;
  saveAudioState();
});

document.addEventListener('DOMContentLoaded', restoreUIState);
