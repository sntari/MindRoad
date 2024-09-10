// 서버에서 EJS로 세션에 있는 user 값을 전달
const user = document.body.getAttribute('data-user');
// let reason;

// user 값이 없으면 .chat-wrapper 요소를 숨김
if (!user) {
	document.querySelector('.chat-wrapper').style.display = 'none';
	document.querySelector('.not_login_main_page').style.display = 'block';
} else {
	document.querySelector('.chat-wrapper').style.display = 'block';
	document.querySelector('.not_login_main_page').style.display = 'none';
}

window.currentInput = null;

document.addEventListener('DOMContentLoaded', function () {
	console.log(user);
	const chatContent = document.getElementById('chatContent');
	const chatInput = document.getElementById('chatInput');
	const sendButton = document.getElementById('sendButton');

	addMessage("안녕하세요! 무엇을 도와드릴까요?", false);

	function addMessage(message, isUser, isLoading = false) {
		const messageWrapper = document.createElement('div');
		messageWrapper.className = `message-wrapper ${isUser ? 'user-wrapper' : 'bot-wrapper'}`;

		// 아이콘 추가
		// 아이콘 추가
		const icon = document.createElement('div');
		if (isUser) {
			// 사용자일 경우 Font Awesome 아이콘 추가
			icon.className = 'icon solid fa-user';
		} else {
			// 봇일 경우 이미지 추가
			const botIcon = document.createElement('img');
			botIcon.src = '../img/글자x로고.png'; // 봇 아이콘 이미지 경로
			botIcon.className = 'icon'; // 공통 클래스 추가
			icon.appendChild(botIcon); // 이미지 요소를 아이콘 요소에 추가
		}
		messageWrapper.appendChild(icon);

		// 메시지 버블 추가
		const messageBubble = document.createElement('div');
		messageBubble.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
		messageWrapper.appendChild(messageBubble);

		chatContent.appendChild(messageWrapper);

		if (isUser) {
			messageBubble.textContent = message;
		} else if (isLoading) {
			const loading = document.createElement('div');
			loading.className = 'loading';
			messageBubble.appendChild(loading);
		} else {
			if (message.includes('\n')) {
				typeMessage(messageBubble, message);
			} else {
				messageBubble.textContent = message;
			}
		}
		scrollToBottom();
		return messageBubble;
	}

	function typeMessage(element, message) {
		element.textContent = '';
		const paragraphs = message.split('\n');
		let paragraphIndex = 0;
		let charIndex = 0;

		function typeCharacter() {
			if (paragraphIndex >= paragraphs.length) {
				scrollToBottom();
				return;
			}

			const currentParagraph = paragraphs[paragraphIndex];

			if (charIndex === 0) {
				const tag = paragraphIndex === paragraphs.length - 1 ? 'span' : 'p';
				const newElement = document.createElement(tag);
				element.appendChild(newElement);
			}

			const pOrSpan = element.querySelectorAll('p, span')[paragraphIndex];

			if (charIndex < currentParagraph.length) {
				pOrSpan.textContent += currentParagraph.charAt(charIndex);
				charIndex++;
				scrollToBottom();
				setTimeout(typeCharacter, 15);
			} else {
				paragraphIndex++;
				charIndex = 0;

				if (paragraphIndex < paragraphs.length) {
					setTimeout(typeCharacter, 15);
				} else {
					scrollToBottom();
				}
			}
		}

		typeCharacter();
	}

	function scrollToBottom() {
		setTimeout(() => {
			chatContent.scrollTop = chatContent.scrollHeight;
		}, 100);
	}

	async function handleSend() {
		const message = chatInput.value.trim();
		if (message) {
			addMessage(message, true);
			chatInput.value = '';

			const botMessageBubble = addMessage("", false, true); // 로딩 애니메이션으로 봇 응답 자리 만들기

			try {
				const botResponse = await getFlaskResponse(message);
				if (botResponse.isProblem) {
					reason = botResponse.input;
					await saveChatbotResponseToNodeServer(botResponse);
				}

				// 로딩 애니메이션 제거
				botMessageBubble.innerHTML = '';

				// 봇 응답 메시지 표시
				typeMessage(botMessageBubble, botResponse.answer);
			} catch (error) {
				// 로딩 애니메이션 제거
				botMessageBubble.innerHTML = '';

				typeMessage(botMessageBubble, "죄송합니다. 오류가 발생했습니다: " + error.message);
			}
		}
	}

	async function getFlaskResponse(userMessage) {
		const url = 'http://localhost:7000/chatbot';
		const headers = {
			'Content-Type': 'application/json'
		};
		const body = JSON.stringify({
			user_nick: user,
			input: userMessage
		});

		try {
			const response = await fetch(url, { method: 'POST', headers, body });

			if (!response.ok) {
				throw new Error(`HTTP 오류! 상태: ${response.status}`);
			}

			const data = await response.json();

			if (data.isProblem) {
				currentInput = data.input;
			}

			if (data.error) {
				throw new Error(data.error);
			}
			console.log(data);
			return data;
		} catch (error) {
			console.error("Flask 서버에서 응답을 가져오는 중 오류 발생:", error);
			throw error;
		}
	}

	async function saveChatbotResponseToNodeServer(data) {
		const url = '/chatbot/saveChatbotResponse';
		const headers = {
			'Content-Type': 'application/json'
		};
		const body = JSON.stringify({
			user: data.user,
			questions: data.input,
			sentiment: data.sentiment
		});

		try {
			const response = await fetch(url, { method: 'POST', headers, body });
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result = await response.json();
			console.log('Chatbot response saved:', result);
		} catch (error) {
			console.error('Error saving chatbot response to Node server:', error);
		}
	}

	sendButton.addEventListener('click', handleSend);
	chatInput.addEventListener('keypress', function (e) {
		if (e.key === 'Enter') {
			handleSend();
		}
	});
});

(function ($) {

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$main = $('#main'),
		$panels = $main.children('.panel'),
		$nav = $('#nav'), $nav_links = $nav.children('a');

	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['361px', '736px'],
		xsmall: [null, '360px']
	});

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Nav.
	$nav_links
		.on('click', function (event) {

			var href = $(this).attr('href');

			// Not a panel link? Bail.
			if (href.charAt(0) != '#nav'
				|| $panels.filter(href).length == 0)
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
			|| $panel.length == 0) {

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
	$window.on('hashchange', function (event) {

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
		setTimeout(function () {

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
			window.setTimeout(function () {

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
		$window.on('--refresh', function () {

			$wrapper.css('height', 'auto');

			window.setTimeout(function () {

				var h = $wrapper.height(),
					wh = $window.height();

				if (h < wh)
					$wrapper.css('height', '100vh');

			}, 0);

		});

		$window.on('resize load', function () {
			$window.triggerHandler('--refresh');
		});

		// Fix intro pic.
		$('.panel.intro').each(function () {

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