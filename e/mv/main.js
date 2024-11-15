window.addEventListener('DOMContentLoaded', function() {
  playVideo(videoList[currentIndex].getAttribute('onclick').match(/'(.*?)'/)[1]);
});

var video = document.getElementById('video');
var videoList = document.querySelectorAll('.video-list li');
var currentIndex = 0;
var autoRandomPlay = false;
var danmuContainer = document.createElement('div');
danmuContainer.classList.add('danmu-container');
document.body.appendChild(danmuContainer);

function selectVideo(index) {
  currentIndex = index;
  updateVideoListScroll();
}

videoList.forEach(function(videoItem, index) {
  videoItem.addEventListener('click', function() {
    selectVideo(index);
    playVideo(videoItem.getAttribute('onclick').match(/'(.*?)'/)[1]);
  });
});

function playVideo(src) {
  if (video.canPlayType) {
    var canPlay = video.canPlayType('video/mp4');
    if (canPlay === 'maybe' || canPlay === 'probably') {
      video.src = src;
      video.play();
      currentIndex = Array.from(videoList).findIndex(function(li) {
        return li.getAttribute('onclick').match(/'(.*?)'/)[1] === src;
      });
      video.addEventListener('ended', function() {
        playNextVideo();
      });
      video.addEventListener('error', function() {
        playNextVideo();
      });
      var currentVideoName = videoList[currentIndex].textContent;
      createDanmu('正在播放视频：' + currentVideoName, 2000);
      updateVideoListScroll();
    } else {
      console.log('该浏览器不支持播放该视频格式');
      playNextVideo();
    }
  } else {
    console.log('该浏览器不支持HTML5视频播放');
    playNextVideo();
  }
}

function togglePlayPause() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

function toggleAutoRandomPlay() {
  autoRandomPlay = !autoRandomPlay;
  if (autoRandomPlay) {
    playRandomVideo();
  }
}

function playRandomVideo() {
  var randomIndex = Math.floor(Math.random() * videoList.length);
  playVideo(videoList[randomIndex].getAttribute('onclick').match(/'(.*?)'/)[1]);
}

function playPreviousVideo() {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = videoList.length - 1;
  }
  playVideo(videoList[currentIndex].getAttribute('onclick').match(/'(.*?)'/)[1]);
  updateVideoListScroll();
}

function playNextVideo() {
  currentIndex++;
  if (currentIndex >= videoList.length) {
    currentIndex = 0;
  }
  playVideo(videoList[currentIndex].getAttribute('onclick').match(/'(.*?)'/)[1]);
  updateVideoListScroll();
}

function updateVideoListScroll() {
  var selectedVideo = document.querySelector('.video-list li.selected');
  if (selectedVideo) {
    selectedVideo.classList.remove('selected');
  }
  videoList[currentIndex].classList.add('selected');
  videoList[currentIndex].scrollIntoView();
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}

document.addEventListener('fullscreenchange', function() {
  if (document.fullscreenElement) {
    createDanmu('全屏模式已开启', 1000);
  } else {
    createDanmu('全屏模式已关闭', 1000);
  }
});

function createDanmu(text, duration) {
  var danmuItem = document.createElement('div');
  danmuItem.classList.add('danmu-item');
  danmuItem.textContent = text;
  danmuContainer.appendChild(danmuItem);

  setTimeout(function() {
    danmuItem.remove();
  }, duration);
}

// 添加键盘按键监听
document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 32: // 空格键
      togglePlayPause();
      break;
    case 37: // 左箭头键
      playPreviousVideo();
      break;
    case 39: // 右箭头键
      playNextVideo();
      break;
    case 38: // 上箭头键
      video.volume += 0.1;
      break;
    case 40: // 下箭头键
      video.volume -= 0.1;
      break;
  }
});
