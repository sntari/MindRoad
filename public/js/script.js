const apiKey = 'YOUR_API_KEY'; // 여기에 OpenAI API 키를 입력하세요.

document.getElementById('chatInput').addEventListener('keydown', async function(event) {
    if (event.key === 'Enter' && this.value.trim() !== '') {
        const userMessage = this.value;
        addUserMessage(userMessage); // 사용자 메시지 추가
        this.value = ''; // 입력창 초기화

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
    return data.reply; // 챗봇의 응답 메시지 반환
}
