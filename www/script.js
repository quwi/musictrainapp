class AudioPlayer {
    constructor() {
        this.audioElement = document.getElementById('audioElement');
        this.fileInput = document.getElementById('audioFile');
        this.playlist = document.getElementById('playlist');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');
        this.currentTrackName = document.getElementById('currentTrackName');

        this.tracks = [];
        this.currentTrackIndex = 0;
        this.isPlaying = false;

        this.initializeEventListeners();
        this.setVolume(80);
        this.setSpeed(100);
    }

    initializeEventListeners() {
        // Mobile file selection
        if (window.cordova) {
            this.fileInput.style.display = 'none';
            const fileLabel = document.querySelector('.file-label');
            fileLabel.addEventListener('click', () => this.selectAudioFilesMobile());
        } else {
            this.fileInput.addEventListener('change', (e) => this.handleFileSelection(e));
        }

        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.speedSlider.addEventListener('input', (e) => this.setSpeed(e.target.value));

        this.audioElement.addEventListener('ended', () => this.playNext());
        this.audioElement.addEventListener('play', () => this.updatePlayButton(true));
        this.audioElement.addEventListener('pause', () => this.updatePlayButton(false));
        this.audioElement.addEventListener('loadstart', () => this.updateCurrentTrackDisplay());
    }

    selectAudioFilesMobile() {
        if (window.fileChooser) {
            window.fileChooser.open({
                "mime": "audio/*"
            }, (uri) => {
                console.log('Selected file URI:', uri);
                window.FilePath.resolveNativePath(uri, (result) => {
                    console.log('Resolved path:', result);
                    this.loadAudioFromPath(uri, result);
                }, (error) => {
                    console.error('FilePath error:', error);
                    this.loadAudioFromPath(uri, uri);
                });
            }, (error) => {
                console.error('File chooser error:', error);
                alert('ファイル選択に失敗しました');
            });
        } else {
            alert('ファイル選択機能が利用できません');
        }
    }

    loadAudioFromPath(uri, path) {
        const fileName = path.split('/').pop() || 'Unknown';
        console.log('Loading audio file:', fileName);

        const trackIndex = this.tracks.length;
        this.tracks.push({
            file: null,
            name: fileName,
            url: uri,
            path: path
        });

        this.addTrackToPlaylistMobile(fileName, trackIndex);

        if (this.tracks.length === 1) {
            this.loadTrack(0);
        }
    }

    addTrackToPlaylistMobile(fileName, trackIndex) {
        const playlistItem = document.createElement('div');
        playlistItem.className = 'playlist-item';
        playlistItem.dataset.trackIndex = trackIndex;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'playlist-item-name';
        nameSpan.textContent = fileName;
        nameSpan.title = fileName;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'playlist-item-remove';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeTrack(trackIndex);
        });

        playlistItem.appendChild(nameSpan);
        playlistItem.appendChild(removeBtn);

        playlistItem.addEventListener('click', () => {
            this.loadTrack(trackIndex);
        });

        this.playlist.appendChild(playlistItem);
    }

    handleFileSelection(event) {
        const files = Array.from(event.target.files);
        files.forEach(file => {
            if (file.type.startsWith('audio/')) {
                this.addTrackToPlaylist(file);
            }
        });

        if (this.tracks.length > 0 && !this.audioElement.src) {
            this.loadTrack(0);
        }
    }

    addTrackToPlaylist(file) {
        const trackIndex = this.tracks.length;
        this.tracks.push({
            file: file,
            name: file.name,
            url: URL.createObjectURL(file)
        });

        const playlistItem = document.createElement('div');
        playlistItem.className = 'playlist-item';
        playlistItem.dataset.trackIndex = trackIndex;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'playlist-item-name';
        nameSpan.textContent = file.name;
        nameSpan.title = file.name;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'playlist-item-remove';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeTrack(trackIndex);
        });

        playlistItem.appendChild(nameSpan);
        playlistItem.appendChild(removeBtn);

        playlistItem.addEventListener('click', () => {
            this.loadTrack(trackIndex);
        });

        this.playlist.appendChild(playlistItem);
    }

    removeTrack(index) {
        URL.revokeObjectURL(this.tracks[index].url);
        this.tracks.splice(index, 1);

        this.rebuildPlaylist();

        if (this.currentTrackIndex >= this.tracks.length) {
            this.currentTrackIndex = Math.max(0, this.tracks.length - 1);
        }

        if (this.tracks.length === 0) {
            this.audioElement.src = '';
            this.currentTrackName.textContent = 'ファイルを選択してください';
            this.updatePlayButton(false);
        } else {
            this.loadTrack(this.currentTrackIndex);
        }
    }

    rebuildPlaylist() {
        this.playlist.innerHTML = '';
        this.tracks.forEach((track, index) => {
            const playlistItem = document.createElement('div');
            playlistItem.className = 'playlist-item';
            playlistItem.dataset.trackIndex = index;

            const nameSpan = document.createElement('span');
            nameSpan.className = 'playlist-item-name';
            nameSpan.textContent = track.name;
            nameSpan.title = track.name;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'playlist-item-remove';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeTrack(index);
            });

            playlistItem.appendChild(nameSpan);
            playlistItem.appendChild(removeBtn);

            playlistItem.addEventListener('click', () => {
                this.loadTrack(index);
            });

            this.playlist.appendChild(playlistItem);
        });

        this.updateActivePlaylistItem();
    }

    loadTrack(index) {
        if (index < 0 || index >= this.tracks.length) return;

        this.currentTrackIndex = index;
        const track = this.tracks[index];

        console.log('Loading track:', track.name);
        this.audioElement.src = track.url;
        this.audioElement.load();

        this.audioElement.addEventListener('loadeddata', () => {
            console.log('Audio loaded successfully, duration:', this.audioElement.duration);
        });

        this.audioElement.addEventListener('error', (e) => {
            console.error('Audio loading error:', e);
            alert('音声ファイルの読み込みに失敗しました: ' + track.name);
        });

        this.updateActivePlaylistItem();
        this.updateCurrentTrackDisplay();
    }

    updateActivePlaylistItem() {
        const items = this.playlist.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            if (index === this.currentTrackIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    updateCurrentTrackDisplay() {
        if (this.tracks.length > 0 && this.tracks[this.currentTrackIndex]) {
            this.currentTrackName.textContent = this.tracks[this.currentTrackIndex].name;
        }
    }

    togglePlayPause() {
        if (!this.audioElement.src) {
            console.log('No audio source loaded');
            return;
        }

        if (this.audioElement.paused) {
            console.log('Attempting to play audio...');
            const playPromise = this.audioElement.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Audio playback started successfully');
                }).catch(error => {
                    console.error('Audio playback failed:', error);
                    alert('音声の再生に失敗しました。ブラウザの音声設定を確認してください。');
                });
            }
        } else {
            this.audioElement.pause();
        }
    }

    updatePlayButton(playing) {
        this.isPlaying = playing;
        this.playPauseBtn.textContent = playing ? '⏸️' : '▶️';
    }

    playPrevious() {
        if (this.tracks.length === 0) return;

        const newIndex = this.currentTrackIndex > 0
            ? this.currentTrackIndex - 1
            : this.tracks.length - 1;

        this.loadTrack(newIndex);

        if (this.isPlaying) {
            this.audioElement.play();
        }
    }

    playNext() {
        if (this.tracks.length === 0) return;

        const newIndex = this.currentTrackIndex < this.tracks.length - 1
            ? this.currentTrackIndex + 1
            : 0;

        this.loadTrack(newIndex);

        if (this.isPlaying) {
            this.audioElement.play();
        }
    }

    setVolume(value) {
        this.audioElement.volume = value / 100;
        this.volumeSlider.value = value;
    }

    setSpeed(value) {
        const speed = value / 100;
        this.audioElement.playbackRate = speed;
        this.speedSlider.value = value;
        this.speedValue.textContent = speed.toFixed(1) + 'x';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AudioPlayer();
});