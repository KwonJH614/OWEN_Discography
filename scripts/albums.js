const albumsContainer = document.querySelector('.albums');

function applyFontBasedOnLanguage(element) {
    const text = element.textContent;
    const splitText = text.split(/([\u3131-\uD79D]+)/g);
    element.innerHTML = '';

    splitText.forEach(part => {
        const span = document.createElement('span');
        if (/[\u3131-\uD79D]/.test(part)) {
            span.style.fontFamily = "'Inter', sans-serif";
            span.className = 'korean';
        } else {
            span.style.fontFamily = "'Bebas Neue', sans-serif";
            span.className = 'english';
        }
        span.textContent = part;
        element.appendChild(span);
    });
}

fetch('/albumData.json')
    .then(response => response.json())
    .then(albumInfo => {
        Object.keys(albumInfo).forEach(albumClass => {
            const album = document.createElement('div');
            album.classList.add('album');

            const albumImg = document.createElement('img');
            albumImg.classList.add(albumClass);
            albumImg.src = albumInfo[albumClass].image;

            const albumTitle = document.createElement('div');
            albumTitle.classList.add('album-title');
            albumTitle.textContent = albumInfo[albumClass].title;

            applyFontBasedOnLanguage(albumTitle);

            album.appendChild(albumImg);
            album.appendChild(albumTitle);
            albumsContainer.appendChild(album);

            albumImg.addEventListener('click', () => {
                const valueToSend = encodeURIComponent(albumClass);
                window.location.href = `musics.html?data=${valueToSend}`;
            });
            albumTitle.addEventListener('click', () => {
                const valueToSend = encodeURIComponent(albumClass);
                window.location.href = `musics.html?data=${valueToSend}`;
            });
            albumImg.addEventListener('mouseover', () => {
                albumTitle.classList.add('hover');
                albumImg.classList.add('imghover');
            });
            albumImg.addEventListener('mouseout', () => {
                albumTitle.classList.remove('hover');
                albumImg.classList.remove('imghover');
            });
            albumTitle.addEventListener('mouseover', () => {
                albumTitle.classList.add('hover');
                albumImg.classList.add('imghover');
            });
            albumTitle.addEventListener('mouseout', () => {
                albumTitle.classList.remove('hover');
                albumImg.classList.remove('imghover');
            });
        });
    })
    .catch(error => console.error('Error loading albumInfo.json:', error));
