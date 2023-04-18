const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const thumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn.btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $('.playlist');

const PLAYER_STORAGE_KEY = "MUSIC_PLAYER_CONFIG";

const app = {
    isRepeat: false,
    isRandom: false,
    isPlaying: false,
    currentIndex: 0,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    songs: [
        {
            name: "Everything",
            singer: "Michael Bublé",
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: "Kissing Strangers",
            singer: "DCNE",
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: "Loser",
            singer: "Charlie Puth",
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: "Nothing",
            singer: "Bruno Major",
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: "Mất tích",
            singer: "Ngọt",
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: "Trên những đám mây",
            singer: "Chillies",
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jfif'
        },
        {
            name: "Anh đã quen với cô đơn",
            singer: "Soobin Sầm Sơn",
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: "Tình yêu mới",
            singer: "Chillies",
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: "Nơi ta chờ em",
            singer: "Will 365",
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        },
        {
            name: "Thói quen",
            singer: "Hoàng Dũng",
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.jpg'
        },
        {
            name: "Thói quen",
            singer: "Hoàng Dũng, G-Ducky",
            path: './assets/music/song11.mp3',
            image: './assets/img/song11.jfif'
        }
    ],
    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    render: function () {
        const htmls = this.songs.map(function (song, index) {
            return `<div class="song ${index === app.currentIndex ? 'active' : ''}" data-index = "${index}">
            <div class="thumb"
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        });
        playlist.innerHTML = htmls.join('');

    },
    handleEvent: function () {
        const _this = this;

        //Xử lý cd quay
        const cdThumbAnimate = thumb.animate([
            { transform: 'rotate(360deg)' }
        ],
            {
                duration: 10000, //10s
                iterations: Infinity
            })
        cdThumbAnimate.pause();

        //Xử lý phóng to, thu nhỏ cd
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            let newCdWidth = cdWidth - scrollTop;
            cd.style.width = (newCdWidth < 0) ? 0 : newCdWidth + 'px';
            cd.style.opacity = ((newCdWidth < 0) ? 0 : newCdWidth) / cdWidth;
        }

        //Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        //Xử lý khi play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        //Xử lý khi pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //Xử lý khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                let currentProgressPercent = (audio.currentTime / audio.duration) * 100;
                progress.value = currentProgressPercent;
            }
        }

        //Xử lý khi tua
        progress.oninput = function () {
            let seekTime = (progress.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        }

        //Xử lý next
        nextBtn.onclick = function () {
            if (_this.isPlaying && _this.isRandom) {
                _this.playRandomSong();
                audio.play();
            } else if (_this.isPlaying && !_this.isRandom) {
                _this.nextSong();
                audio.play();
            } else _this.nextSong();
        }

        //Xử lý prev
        prevBtn.onclick = function () {
            if (_this.isPlaying && _this.isRandom) {
                _this.playRandomSong();
                audio.play();
            } else if (_this.isPlaying && !_this.isRandom) {
                _this.prevSong();
                audio.play();
            } else _this.prevSong();
        }

        //Xử lý random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        //Xử lý repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        //Xử lý next khi bài hát kết thúc
        audio.onended = function () {
            if (_this.isRepeat) {
                _this.loadCurrentSong();
                audio.play();
            } else {
                if (_this.isRandom) {
                    _this.playRandomSong();
                } else _this.nextSong();
                audio.play();
            }
        }

        //Xử lý khi bấm chọn bài hát
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode) {
                app.currentIndex = Number(songNode.dataset.index);
                app.loadCurrentSong();
                audio.play();
                app.render();
            }
        }

    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;

        //Hiển thị trạng thái ban đầu của randomBtn, repeatBtn
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
    ,
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        thumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    scrollToActiveSong: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: (app.currentIndex < 4 ? 'center' : 'nearest') //3 is a random number
            });
        }, 300)
    }
    ,
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        this.render();
        this.scrollToActiveSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        this.render();
        this.scrollToActiveSong();
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        this.render();
        this.scrollToActiveSong();
    }
    ,
    start: function () {
        //Load config
        this.loadConfig();

        //Định nghĩa thuộc tính cho Object
        this.defineProperties();

        //Lắng nghe sự kiện DOM
        this.handleEvent();

        //Tải bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //Render Playlist
        this.render();
    }
};
app.start();