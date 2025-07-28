$(document).ready(function () {
  
  const setUserAvatar = (id) => {
    const link = `https://api.lanyard.rest/v1/users/${id}`;
    $.getJSON(link, function(json) {
      const uuid = json.data.discord_user.avatar;
      const avatarlink = `https://cdn.discordapp.com/avatars/${id}/${uuid}.png`;
      console.log("Recieved user avatar:", avatarlink);
      $('.avatar').css('background-image', `url(${avatarlink})`);
    }).fail(function(err) {
      console.error('Error getting user avatar:', err);
    });
  };



  const gibberishEffect = (options) => {
    let element = options.el;
    if (!element) return;

    let result = '';
    let text = options.text;
    let possibleChars = options.possible ? options.possible : 'ABCDEFASIRUWJFCKSJHYWRKJEsdfskdjfk-+*/|}{[]~\\":;?/.><=+-_)(*&^%$#@!)}';
    let delay = options.delay ? options.delay : 70;
    let randomOffset = Math.floor(Math.random() * 500);

    const setText = (index, newText) => {
      setTimeout(() => {
        element.innerText = newText;
      }, index * delay + randomOffset);
    };

    for (let i = 0; i < text.length + 1; i++) {
      result = text.substr(0, i);
      for (let j = i; j < text.length; j++) {
        result += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
      }
      setText(i, result);
      result = '';
    }
  };

  
  const gibberishEffectTitle = (options) => {
    let text = options.text;
    let possibleChars = options.possible ? options.possible : 'ABCDEFASIRUWJFCKSJHYWRKJEsdfskdjfk-+*/|}{[]~\\":;?/.><=+-_)(*&^%$#@!)}';
    let delay = options.delay ? options.delay : 70;
    let randomOffset = Math.floor(Math.random() * 500);

    const setTitle = (index, newText) => {
      setTimeout(() => {
        document.title = newText;
      }, index * delay + randomOffset);
    };

    for (let i = 0; i < text.length + 1; i++) {
      let result = text.substr(0, i);
      for (let j = i; j < text.length; j++) {
        result += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
      }
      setTitle(i, result);
    }

    setTimeout(() => {
      document.title = text;
    }, text.length * delay + randomOffset);
  };

  
  const audioElement = new Audio('assets/other/music.mp3');
  audioElement.volume = 0.05;
  audioElement.addEventListener('ended', function () {
    location.reload(false);
  });

  setUserAvatar("680636323471818876")

  $('.click').on('click', function () {
    $('.click').fadeOut(300);
    setTimeout(function () {
      $('.page').fadeIn(300);
      audioElement.play();
      const particlesConfig = {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: '#ffffff',
          },
          shape: {
            type: 'circle',
            stroke: {
              width: 0,
              color: '#000000',
            },
            polygon: {
              nb_sides: 5,
            },
          },
          opacity: {
            value: 0.5,
            random: false,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false,
            },
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: false,
              speed: 40,
              size_min: 0.1,
              sync: false,
            },
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'repulse',
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 400,
              line_linked: {
                opacity: 1,
              },
            },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
            push: {
              particles_nb: 4,
            },
            remove: {
              particles_nb: 2,
            },
          },
        },
        retina_detect: true,
      };
      
      particlesJS('particles-js', particlesConfig);      
    }, 300);

    const blockTitle = $('.main-block h1');
    const blockTitleText = blockTitle.text();
    const blockParagraph = $('.main-block p');
    const blockParagraphText = blockParagraph.text();
    const documentTitle = document.title;

    setInterval(function () {
      const titleOptions = {
        el: blockTitle[0],
        text: blockTitleText,
      };
      gibberishEffect(titleOptions);

      const paragraphOptions = {
        el: blockParagraph[0],
        text: blockParagraphText,
      };
      gibberishEffect(paragraphOptions);

      const documentTitleOptions = {
        text: documentTitle,
      };
      gibberishEffectTitle(documentTitleOptions);
    }, 3500);
  });
});

$(window).on('load', function () {
  $('#loader').fadeOut(300);
});
