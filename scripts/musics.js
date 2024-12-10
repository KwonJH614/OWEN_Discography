fetch('/albumData.json')
    .then(response => response.json())
    .then(albumData => {
        const urlParams = new URLSearchParams(window.location.search);
        const receivedData = urlParams.get('data') || 'No data received';

        const selectedAlbum = albumData[receivedData];

        if (selectedAlbum) {
            document.querySelector('.albumImage').src = selectedAlbum.image;
            document.querySelector('.albumTitle').textContent = receivedData.replace(/_/g, ' ');
            document.querySelector('.containerImage').src = selectedAlbum.image;
            document.querySelector('.containerTitle').textContent = receivedData.replace(/_/g, ' ');

            document.querySelector('.albumDescription').textContent = selectedAlbum.description;
            document.querySelector('.albumDetails').textContent = `${selectedAlbum.date} | ${selectedAlbum.trackCount} Tracks | ${selectedAlbum.duration}`;

            const musicContainer = document.querySelector('.musics');
            musicContainer.innerHTML = '';
            selectedAlbum.titles.forEach(title => {
                const musicItem = document.createElement('div');
                musicItem.className = 'music';
                musicItem.textContent = title;
                musicContainer.appendChild(musicItem);
            });

            applyFontStylesToMixedText('.albumTitle');
            applyFontStylesToMixedText('.albumDescription');
            applyFontStylesToMixedText('.music');
        } else {
            console.error('Invalid album data or album not found');
        }
    })
    .catch(error => console.error('Error fetching album data:', error));

function applyFontStylesToMixedText(selector) {
    document.querySelectorAll(selector).forEach(el => {
        if (el.tagName.toLowerCase() === 'h1' || el.className.toLowerCase() === 'footer-album-title') {
            return; 
        }
        if (el.className.toLowerCase() === 'footer-music-title') {
            const isKorean = /[\u3131-\uD79D]/.test(el.textContent); 
            if (isKorean) { 
                el.style.fontFamily = 'Inter, sans-serif';
                el.style.fontWeight = '550'; 
                el.style.letterSpacing = '0.1px'; 
                el.style.fontSize = '25px';
                el.style.marginBottom = '2px';
            } else {
                el.style.fontFamily = 'Bebas Neue, sans-serif';
                el.style.fontWeight = 'normal'; 
                el.style.letterSpacing = 'normal';
                el.style.fontSize = ''; 
                el.style.marginBottom = '';
            }
            return; 
        }        
        
        const text = el.textContent;
        const splitText = text.split(/([\u3131-\uD79D]+)/g); 
        el.innerHTML = '';

        splitText.forEach(part => {
            const span = document.createElement('span');
            if (/[\u3131-\uD79D]/.test(part)) { 
                span.style.fontFamily = 'Inter, sans-serif';
                span.className = 'korean';
            } else { 
                span.style.fontFamily = 'Bebas Neue, sans-serif';
                span.className = 'english';
            }
            span.textContent = part;
            el.appendChild(span);
        });
    });
}

