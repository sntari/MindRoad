document.addEventListener('DOMContentLoaded', function () {
    const cardImageMap = {
        0: "The Fool.jpg",
        1: "The Magician.jpg",
        2: "The High Priestess.jpg",
        3: "The Empress.jpg",
        4: "The Emperor.jpg",
        5: "The Hierophant.jpg",
        6: "The Lovers.jpg",
        7: "The Chariot.jpg",
        8: "The Strength.jpg",
        9: "The Hermit.jpg",
        10: "Wheel of Fortune.jpg",
        11: "Justice.jpg",
        12: "The Hanged Man.jpg",
        13: "Death.jpg",
        14: "Temperance.jpg",
        15: "The Devil.jpg",
        16: "The Tower.jpg",
        17: "The Star.jpg",
        18: "The Moon.jpg",
        19: "The Sun.jpg",
        20: "Judgement.jpg",
        21: "The World.jpg",
        22: "Ace of Wands.jpg",
        23: "Ace of Pentacles.jpg",
        24: "Ace of Cups.jpg",
        25: "Ace of Swords.jpg",
        26: "Two of Wands.jpg",
        27: "Two of Pentacles.jpg",
        28: "Two of Cups.jpg",
        29: "Two of Swords.jpg",
        30: "Three of Wands.jpg",
        31: "Three of Pentacles.jpg",
        32: "Three of Cups.jpg",
        33: "Three of Swords.jpg",
        34: "Four of Wands.jpg",
        35: "Four of Pentacles.jpg",
        36: "Four of Cups.jpg",
        37: "Four of Swords.jpg",
        38: "Five of Wands.jpg",
        39: "Five of Pentacles.jpg",
        40: "Five of Cups.jpg",
        41: "Five of Swords.jpg",
        42: "Six of Wands.jpg",
        43: "Six of Pentacles.jpg",
        44: "Six of Cups.jpg",
        45: "Six of Swords.jpg",
        46: "Seven of Wands.jpg",
        47: "Seven of Pentacles.jpg",
        48: "Seven of Cups.jpg",
        49: "Seven of Swords.jpg",
        50: "Eight of Wands.jpg",
        51: "Eight of Pentacles.jpg",
        52: "Eight of Cups.jpg",
        53: "Eight of Swords.jpg",
        54: "Nine of Wands.jpg",
        55: "Nine of Pentacles.jpg",
        56: "Nine of Cups.jpg",
        57: "Nine of Swords.jpg",
        58: "Ten of Wands.jpg",
        59: "Ten of Pentacles.jpg",
        60: "Ten of Cups.jpg",
        61: "Ten of Swords.jpg",
        62: "Page of Wands.jpg",
        63: "Page of Pentacles.jpg",
        64: "Page of Cups.jpg",
        65: "Page of Swords.jpg",
        66: "Knight of Wands.jpg",
        67: "Knight of Pentacles.jpg",
        68: "Knight of Cups.jpg",
        69: "Knight of Swords.jpg",
        70: "Queen of Wands.jpg",
        71: "Queen of Pentacles.jpg",
        72: "Queen of Cups.jpg",
        73: "Queen of Swords.jpg",
        74: "King of Wands.jpg",
        75: "King of Pentacles.jpg",
        76: "King of Cups.jpg",
        77: "King of Swords.jpg"
    };
    const cards = document.querySelectorAll('.card');
    const selectedCardsContainer = document.querySelector('.selected-cards-container');
    const selectedCardInfo = document.getElementById('selected-card-info');
    const spreadButton = document.getElementById('spread-cards');

    let selectedCards = [];
    let selectedCardname = [];
    let isSpread = false;

    function initializeCardClickEvents() {
        cards.forEach((card) => {
            card.addEventListener('click', function () {
                handleCardClick(card);
            });
        });
    }

    function handleCardClick(card) {
        const cardId = parseInt(card.getAttribute('data-card-id'));
        const cardName = cardImageMap[cardId].replace('.jpg', '');

        if (selectedCards.length >= 3) {
            alert("이미 3장의 카드를 선택했습니다.");
            return;
        }

        if (selectedCards.includes(cardId)) {
            alert("이미 선택한 카드입니다.");
            return;
        }

        selectedCards.push(cardId);
        selectedCardname.push(cardName);

        // 선택된 카드 숨기기
        card.style.display = 'none';

        updateSelectedCards();

        if (selectedCards.length === 3) {
            sendSelectedCardsToFlask();
            spreadButton.disabled = true;
        }

        updateSpreadButton();
    }

    function updateSelectedCards() {
        const selectedCardElements = document.querySelectorAll('.selected-card');

        selectedCards.forEach((cardId, index) => {
            if (index < 3) {
                const selectedCardInner = selectedCardElements[index].querySelector('.selected-card-inner');
                const selectedCardFront = selectedCardElements[index].querySelector('.selected-card-front');

                const img = document.createElement('img');
                img.src = `/img/${cardImageMap[cardId]}`;
                img.alt = `선택된 카드 ${cardId + 1}`;
                img.style.width = '100%';
                img.style.height = '100%';

                img.onload = () => {
                    selectedCardFront.innerHTML = '';
                    selectedCardFront.appendChild(img);
                    selectedCardInner.classList.add('flipped');

                    // 선택된 카드 영역에서 카드 펼치기 애니메이션
                    selectedCardElements[index].style.transform = `translateX(${index * 120}px)`;
                    selectedCardElements[index].style.transition = 'transform 0.5s ease';
                };

                img.onerror = () => {
                    console.error(`이미지를 로드할 수 없습니다: /img/${cardImageMap[cardId]}`);
                    selectedCardFront.textContent = `카드 ${cardId + 1}`;
                    selectedCardInner.classList.add('flipped');
                };
            }
        });
    }
    // 카드 펼치기/섞기 버튼 이벤트
    spreadButton.addEventListener('click', function () {
        if (!isSpread) {
            toggleCardSpread();
        } else {
            shuffleCards();
        }
        updateSpreadButton();
    });

    // 카드 펼치기 함수
    function toggleCardSpread() {
        cards.forEach((card, index) => {
            if (!isSpread) {
                card.style.left = `${20 + index * 15}px`;
                card.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
            } else {
                card.style.left = '20px';
                card.style.transform = 'rotate(0deg)';
            }
        });
        isSpread = !isSpread;
    }

    // 카드 섞기 함수
    function shuffleCards() {
        const unselectedCards = Array.from(cards).filter(card => !selectedCards.includes(parseInt(card.getAttribute('data-card-id'))));
        for (let i = unselectedCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [unselectedCards[i].style.left, unselectedCards[j].style.left] = [unselectedCards[j].style.left, unselectedCards[i].style.left];
            [unselectedCards[i].style.transform, unselectedCards[j].style.transform] = [unselectedCards[j].style.transform, unselectedCards[i].style.transform];
        }
    }

    // 버튼 텍스트 업데이트 함수
    function updateSpreadButton() {
        if (selectedCards.length === 3) {
            spreadButton.textContent = '카드 선택 완료';
            spreadButton.disabled = true;
        } else if (isSpread) {
            spreadButton.textContent = '카드 섞기';
        } else {
            spreadButton.textContent = '카드 펼치기';
        }
    }


    // 선택된 카드 업데이트 함수
    function updateSelectedCards() {
        const selectedCardElements = document.querySelectorAll('.selected-card');

        selectedCards.forEach((cardId, index) => {
            if (index < 3) { // 최대 3개까지만 처리
                const selectedCardInner = selectedCardElements[index].querySelector('.selected-card-inner');
                const selectedCardFront = selectedCardElements[index].querySelector('.selected-card-front');

                // 이미지 설정
                const img = document.createElement('img');
                img.src = `/img/${cardImageMap[cardId]}`;
                img.alt = `선택된 카드 ${cardId + 1}`;
                img.style.width = '100%';
                img.style.height = '100%';

                // 이미지 로드 여부 확인
                img.onload = () => {
                    selectedCardFront.innerHTML = ''; // 기존 내용 제거
                    selectedCardFront.appendChild(img); // 이미지 추가
                    selectedCardInner.classList.add('flipped'); // 카드 앞면 보이도록 설정
                };

                img.onerror = () => {
                    console.error(`이미지를 로드할 수 없습니다: /img/${cardImageMap[cardId]}`);
                    selectedCardFront.textContent = `카드 ${cardId + 1}`;
                    selectedCardInner.classList.add('flipped');
                };
            }
        });

        // 선택된 카드가 3개 미만일 경우 나머지 카드들은 뒤집기
        for (let i = selectedCards.length; i < 3; i++) {
            const selectedCardInner = selectedCardElements[i].querySelector('.selected-card-inner');
            selectedCardInner.classList.remove('flipped'); // 뒷면으로 설정
            selectedCardElements[i].querySelector('.selected-card-front').innerHTML = ''; // 내용 제거
        }
    }

    // 카드 초기화 함수
    function resetCards() {
        selectedCards = [];
        selectedCardname = [];

        cards.forEach((card) => {
            const cardInner = card.querySelector('.card-inner');
            cardInner.classList.remove('flipped');
            card.style.zIndex = '';
            card.style.transform = 'rotate(0deg)';
            card.style.left = '20px';
            card.style.display = ''; // 숨겨진 카드들을 다시 표시
            card.querySelector('.card-front').innerHTML = '';
        });

        if (isSpread) {
            toggleCardSpread();
        }

        isSpread = false;

        const selectedCardElements = document.querySelectorAll('.selected-card');
        selectedCardElements.forEach((element, index) => {
            const selectedCardInner = element.querySelector('.selected-card-inner');
            selectedCardInner.classList.remove('flipped');
            element.querySelector('.selected-card-front').innerHTML = '';
            element.style.transform = ''; // 선택된 카드 영역 초기화
            element.style.transition = '';
        });

        spreadButton.disabled = false;
        spreadButton.textContent = '카드 펼치기';
    }


    // 초기화 버튼 클릭 이벤트
    const drawAgainButton = document.getElementById('draw-again');
    drawAgainButton.addEventListener('click', resetCards);

    // 카테고리 버튼 클릭 이벤트 초기화
    const categoryButtons = document.querySelectorAll('.category-button');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            // 모든 버튼에서 active 클래스 제거
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // 클릭된 버튼에 active 클래스 추가
            this.classList.add('active');
        });
    });


    // 카드 클릭 이벤트 초기화
    initializeCardClickEvents();
    updateSpreadButton();
});