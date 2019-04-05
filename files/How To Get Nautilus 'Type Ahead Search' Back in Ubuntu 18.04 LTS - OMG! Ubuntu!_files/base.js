var completedKey = "omg_first_visit_completed";
if (!(new RegExp("(?:^|;\\s*)" + completedKey + "\\s*\\=")).test(document.cookie)) {
  document.cookie = completedKey + "=1; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
  $('body').append('<div class="CookieWarning is-active">' +
    '<p>This site uses cookies. <a target="_blank" class="CookieWarning-learnMore" href="/privacy-policy">Learn more</a>.</p>'+
    '<button class="is-link CookieWarning-consent">Okay</button>'+
    '</div>'
  );
  $('.CookieWarning-consent, .CookieWarning-learnMore').click(function() {
    $('.CookieWarning').remove();
  });
}

Array.prototype.forEach.call(document.querySelectorAll('.gallery'), function(gallery) {
  var images = Array.prototype.reduce.call(gallery.querySelectorAll('.gallery-item'), function(arr, item, idx) {
    var link = item.querySelector('a');
    var caption = item.querySelector('dd');
    if (link.dataset && link.dataset.height && link.dataset.width) {
      arr.push({
        src: link.href,
        w: link.dataset.width,
        h: link.dataset.height,
        title: caption && caption.innerHTML || null
      });
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var options = {
          index: idx
        };
        var ps = new PhotoSwipe(document.querySelector('.pswp'), PhotoSwipeUI_Default, images, options);
        ps.init();
      });
    }
    return arr;
  }, []);
});

var searchContainer = document.querySelector('.HeaderSearch');
var searchValue = document.querySelector('.HeaderSearch-input');
var header = document.querySelector('.Header');
var isArticle = !!document.querySelector('.single-post');

document.querySelector('.HeaderSearch-button--submit').addEventListener('click', (e) => {
  if (!searchContainer.classList.contains('is-active') || !searchValue.value) {
    e.preventDefault();
    searchContainer.classList.add('is-active');
    searchValue.focus();
  }
});

if (window.matchMedia) {
  var query = window.matchMedia('(max-width: 800px)');
  query.addListener(function(e) {
    if (!e.matches) {
      header.classList.remove('is-mobile-nav-active');
    }
  });
}

document.querySelector('.HeaderMenu--submit').addEventListener('click', (e) => {
  header.classList.add('is-mobile-nav-active');
});

document.querySelector('.HeaderMenu--cancel').addEventListener('click', (e) => {
  header.classList.remove('is-mobile-nav-active');
});

document.querySelector('.HeaderSearch-button--cancel').addEventListener('click', () => {
  searchValue.value = '';
  searchContainer.classList.remove('is-active');
});

if (isArticle && window.MutationObserver) {
  var count = document.querySelector('.omg-track-comment-count');
  var container = document.querySelector('.omg-socials__comments');

  function updateCount() {
    container.href += '#disqus_thread';
    if (count.textContent === 'Read More') {
      container.innerHTML += '<span>0</span>';
      return;
    }

    container.innerHTML += '<span>' + count.textContent.replace(' Comments', '') + '</span>';
  }
  var observer = new MutationObserver(function(mutations) {
    observer.disconnect()
    updateCount();
  });

  if (count.textContent !== '0') {
    updateCount();
  }

  observer.observe(count, { childList: true });
}

var shareWindow;
jQuery('.omg-socials__button a').on('click', function() {
  const el = $(this);
  if (['facebook', 'twitter', 'telegram', 'pocket'].indexOf(el.data('type')) !== -1) {
    if (typeof shareWindow !== 'undefined') {
      shareWindow.close();
    }
    shareWindow = window.open(el.attr('href'), 'omgshare', 'menubar=1,resizable=1,width=600,height=450');
    return false;
  }
})