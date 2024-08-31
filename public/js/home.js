// 서버에서 EJS로 세션에 있는 user 값을 전달
const user = document.body.getAttribute('data-user');

// user 값이 없으면 .chat-wrapper 요소를 숨김
if (!user) {
	document.querySelector('.chat-wrapper').style.display = 'none';
	document.querySelector('.not_login_main_page').style.display = 'block';
} else {
	document.querySelector('.chat-wrapper').style.display = 'block';
	document.querySelector('.not_login_main_page').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
	const chatContent = document.getElementById('chatContent');
	const chatInput = document.getElementById('chatInput');
	const sendButton = document.getElementById('sendButton');
	const apiKey = ''; // API 키를 여기에 입력하세요

	addMessage("안녕하세요! 무엇을 도와드릴까요?", false);

	function addMessage(message, isUser) {
		const messageDiv = document.createElement('div');
		messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
		chatContent.appendChild(messageDiv);

		if (isUser) {
			messageDiv.textContent = message;
			scrollToBottom();
		} else {
			typeMessage(messageDiv, message);
		}
	}

	function typeMessage(element, message) {
		let i = 0;
		const interval = setInterval(() => {
			if (i < message.length) {
				element.textContent += message.charAt(i);
				i++;
				scrollToBottom();
			} else {
				clearInterval(interval);
			}
		}, 10); // 타이핑 속도 조절 (밀리초 단위)
	}

	function scrollToBottom() {
		setTimeout(() => {
			chatContent.scrollTop = chatContent.scrollHeight;
		}, 0); // 0ms 지연 시간
	}

	async function handleSend() {
		const message = chatInput.value.trim();
		if (message) {
			addMessage(message, true);
			chatInput.value = '';
			try {
				const botResponse = await getChatGPTResponse(message);
				addMessage(botResponse, false);
			} catch (error) {
				addMessage("죄송합니다. 오류가 발생했습니다: " + error.message, false);
			}
		}
	}

	async function getChatGPTResponse(userMessage) {
		const url = 'https://api.openai.com/v1/chat/completions';
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`
		};
		const body = JSON.stringify({
			model: "gpt-4", // 또는 "gpt-4" (접근 권한이 있는 경우)
			messages: [
				{ role: "system", content: "You are a helpful assistant." },
				{ role: "user", content: userMessage }
			]
		});

		try {
			const response = await fetch(url, { method: 'POST', headers, body });

			if (!response.ok) {
				throw new Error(`HTTP 오류! 상태: ${response.status}`);
			}

			const data = await response.json();

			if (data.choices && data.choices.length > 0) {
				return data.choices[0].message.content;
			} else {
				throw new Error("유효하지 않은 API 응답 구조입니다.");
			}
		} catch (error) {
			console.error("ChatGPT API에서 응답을 가져오는 중 오류 발생:", error);
			throw error;
		}
	}

	sendButton.addEventListener('click', handleSend);
	chatInput.addEventListener('keypress', function (e) {
		if (e.key === 'Enter') {
			handleSend();
		}
	});
});


(function($) {

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$main = $('#main'),
		$panels = $main.children('.panel'),
		$nav = $('#nav'), $nav_links = $nav.children('a');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '361px',   '736px'  ],
			xsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Nav.
		$nav_links
			.on('click', function(event) {

				var href = $(this).attr('href');

				// Not a panel link? Bail.
					if (href.charAt(0) != '#nav'
					||	$panels.filter(href).length == 0)
						return;

				// Prevent default.
					event.preventDefault();
					event.stopPropagation();

				// Change panels.
					if (window.location.hash != href)
						window.location.hash = href;

			});

	// Panels.

		// Initialize.
			$(window).ready(() => {
				var $panel, $link;

				// Get panel, link.
					if (window.location.hash) {

				 		$panel = $panels.filter(window.location.hash);
						$link = $nav_links.filter('[href="' + window.location.hash + '"]');

					}

				// No panel/link? Default to first.
					if (!$panel
					||	$panel.length == 0) {

						$panel = $panels.first();
						$link = $nav_links.first();

					}

				// Deactivate all panels except this one.
					$panels.not($panel)
						.addClass('inactive')
						.hide();

				// Activate link.
					$link
						.addClass('active');

				// Reset scroll.
					$window.scrollTop(0);

			})

		// Hashchange event.
			$window.on('hashchange', function(event) {

				var $panel, $link;

				// Get panel, link.
					if (window.location.hash) {

				 		$panel = $panels.filter(window.location.hash);
						$link = $nav_links.filter('[href="' + window.location.hash + '"]');

						// No target panel? Bail.
							if ($panel.length == 0)
								return;

					}

				// No panel/link? Default to first.
					else {

						$panel = $panels.first();
						$link = $nav_links.first();

					}

				// Deactivate all panels.
					$panels.addClass('inactive');

				// Deactivate all links.
					$nav_links.removeClass('active');

				// Activate target link.
					$link.addClass('active');

				// Set max/min height.
					$main
						.css('max-height', $main.height() + 'px')
						.css('min-height', $main.height() + 'px');

				// Delay.
					setTimeout(function() {

						// Hide all panels.
							$panels.hide();

						// Show target panel.
							$panel.show();

						// Set new max/min height.
							$main
								.css('max-height', $panel.outerHeight() + 'px')
								.css('min-height', $panel.outerHeight() + 'px');

						// Reset scroll.
							$window.scrollTop(0);

						// Delay.
							window.setTimeout(function() {

								// Activate target panel.
									$panel.removeClass('inactive');

								// Clear max/min height.
									$main
										.css('max-height', '')
										.css('min-height', '');

								// IE: Refresh.
									$window.triggerHandler('--refresh');

								// Unlock.
									locked = false;

							}, (breakpoints.active('small') ? 0 : 500));

					}, 250);

			});

	// IE: Fixes.
		if (browser.name == 'ie') {

			// Fix min-height/flexbox.
				$window.on('--refresh', function() {

					$wrapper.css('height', 'auto');

					window.setTimeout(function() {

						var h = $wrapper.height(),
							wh = $window.height();

						if (h < wh)
							$wrapper.css('height', '100vh');

					}, 0);

				});

				$window.on('resize load', function() {
					$window.triggerHandler('--refresh');
				});

			// Fix intro pic.
				$('.panel.intro').each(function() {

					var $pic = $(this).children('.pic'),
						$img = $pic.children('img');

					$pic
						.css('background-image', 'url(' + $img.attr('src') + ')')
						.css('background-size', 'cover')
						.css('background-position', 'center');

					$img
						.css('visibility', 'hidden');

				});

		}

})(jQuery);
/*
	Astral by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

document.getElementById('chatInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && this.value.trim() !== '') {
        const message = this.value;
        addUserMessage(message); // 사용자 메시지 추가
        this.value = ''; // 입력창 초기화
    }
});

function addUserMessage(message) {
    const chatContent = document.getElementById('chatContent');
    const userMessageElement = document.createElement('div');
    userMessageElement.className = 'user-message';
    userMessageElement.textContent = message;
    chatContent.appendChild(userMessageElement);

    // 스크롤을 맨 아래로 이동
    chatContent.scrollTop = chatContent.scrollHeight;
}

function addBotMessage(message) {
    const chatContent = document.getElementById('chatContent');
    const botMessageElement = document.createElement('div');
    botMessageElement.className = 'bot-message';
    botMessageElement.textContent = message;
    chatContent.appendChild(botMessageElement);

    // 스크롤을 맨 아래로 이동
    chatContent.scrollTop = chatContent.scrollHeight;
}

// 예시: 챗봇이 응답하는 경우
setTimeout(() => {
    addBotMessage("저는 챗봇입니다! 무엇을 도와드릴까요?");
}, 1000);

(function($) {

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$main = $('#main'),
		$panels = $main.children('.panel'),
		$nav = $('#nav'), $nav_links = $nav.children('a');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '361px',   '736px'  ],
			xsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Nav.
		$nav_links
			.on('click', function(event) {

				var href = $(this).attr('href');

				// Not a panel link? Bail.
					if (href.charAt(0) != '#nav'
					||	$panels.filter(href).length == 0)
						return;

				// Prevent default.
					event.preventDefault();
					event.stopPropagation();

				// Change panels.
					if (window.location.hash != href)
						window.location.hash = href;

			});

	// Panels.

		// Initialize.
			(function() {

				var $panel, $link;

				// Get panel, link.
					if (window.location.hash) {

				 		$panel = $panels.filter(window.location.hash);
						$link = $nav_links.filter('[href="' + window.location.hash + '"]');

					}

				// No panel/link? Default to first.
					if (!$panel
					||	$panel.length == 0) {

						$panel = $panels.first();
						$link = $nav_links.first();

					}

				// Deactivate all panels except this one.
					$panels.not($panel)
						.addClass('inactive')
						.hide();

				// Activate link.
					$link
						.addClass('active');

				// Reset scroll.
					$window.scrollTop(0);

			})();

		// Hashchange event.
			$window.on('hashchange', function(event) {

				var $panel, $link;

				// Get panel, link.
					if (window.location.hash) {

				 		$panel = $panels.filter(window.location.hash);
						$link = $nav_links.filter('[href="' + window.location.hash + '"]');

						// No target panel? Bail.
							if ($panel.length == 0)
								return;

					}

				// No panel/link? Default to first.
					else {

						$panel = $panels.first();
						$link = $nav_links.first();

					}

				// Deactivate all panels.
					$panels.addClass('inactive');

				// Deactivate all links.
					$nav_links.removeClass('active');

				// Activate target link.
					$link.addClass('active');

				// Set max/min height.
					$main
						.css('max-height', $main.height() + 'px')
						.css('min-height', $main.height() + 'px');

				// Delay.
					setTimeout(function() {

						// Hide all panels.
							$panels.hide();

						// Show target panel.
							$panel.show();

						// Set new max/min height.
							$main
								.css('max-height', $panel.outerHeight() + 'px')
								.css('min-height', $panel.outerHeight() + 'px');

						// Reset scroll.
							$window.scrollTop(0);

						// Delay.
							window.setTimeout(function() {

								// Activate target panel.
									$panel.removeClass('inactive');

								// Clear max/min height.
									$main
										.css('max-height', '')
										.css('min-height', '');

								// IE: Refresh.
									$window.triggerHandler('--refresh');

								// Unlock.
									locked = false;

							}, (breakpoints.active('small') ? 0 : 500));

					}, 250);

			});

	// IE: Fixes.
		if (browser.name == 'ie') {

			// Fix min-height/flexbox.
				$window.on('--refresh', function() {

					$wrapper.css('height', 'auto');

					window.setTimeout(function() {

						var h = $wrapper.height(),
							wh = $window.height();

						if (h < wh)
							$wrapper.css('height', '100vh');

					}, 0);

				});

				$window.on('resize load', function() {
					$window.triggerHandler('--refresh');
				});

			// Fix intro pic.
				$('.panel.intro').each(function() {

					var $pic = $(this).children('.pic'),
						$img = $pic.children('img');

					$pic
						.css('background-image', 'url(' + $img.attr('src') + ')')
						.css('background-size', 'cover')
						.css('background-position', 'center');

					$img
						.css('visibility', 'hidden');

				});

		}

})(jQuery);