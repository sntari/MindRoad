const apiKey = 'YOUR_API_KEY'; // 여기에 OpenAI API 키를 입력하세요.

document.getElementById('chatInput').addEventListener('keydown', async function(event) {
    if (event.key === 'Enter' && this.value.trim() !== '') {
        const userMessage = this.value;
        addUserMessage(userMessage); // 사용자 메시지 추가
        this.value = ''; // 입력창 초기화
        console.log(`${getCurrentTime()}`);

        const botResponse = await getBotResponse(userMessage); // 챗봇 응답 받기
        addBotMessage(botResponse); // 챗봇 메시지 추가
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

// OpenAI API를 호출하여 챗봇 응답을 가져오는 함수
async function getBotResponse(userMessage) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
    });

    if (!response.ok) {
        console.error('API 호출 오류:', response.statusText);
        return '죄송합니다. 오류가 발생했습니다.';
    }

    const data = await response.json();
    const botReply = data.reply; // 챗봇의 응답 메시지 반환
    return `${botReply}`;
}

// 현재 시간을 HH:MM:SS 형식으로 반환하는 함수
function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    console.log(`${hours}:${minutes}:${seconds}`);
    return `${hours}:${minutes}:${seconds}`;
}

// 서버에서 EJS로 세션에 있는 user 값을 전달
const user = "<%= user %>";
        
// user 값이 없으면 .chat-wrapper 요소를 숨김
if (!user) {
    document.querySelector('.chat-wrapper').style.display = 'none';
    document.querySelector('.not_login_main_page').style.display = 'block';
} else {
    document.querySelector('.chat-wrapper').style.display = 'block';
    document.querySelector('.not_login_main_page').style.display = 'none';
}