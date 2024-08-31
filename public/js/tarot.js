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
    const spreadButton = document.getElementById('spread-cards');
    const categoryButtons = document.querySelectorAll('.category-button');
    const userButtons = document.querySelectorAll('.user-button');
    const psychologicalButton = document.getElementById('psychological-button');
    const drawAgainButton = document.getElementById('draw-again');

    let selectedCards = [];
    let selectedCardname = [];
    let isSpread = false;
    let selectedCategory = null;

    // 서버의 세션에서 가져온 reason 값 (서버에서 전달받아야 합니다)
    const reason = '<%= session.reason || "" %>';

    function initializeButtons() {
        // 카테고리 버튼 클릭 이벤트
        categoryButtons.forEach(button => {
            button.addEventListener('click', function () {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                selectedCategory = this.textContent;
                console.log('Selected category:', selectedCategory);  // 디버깅용
            });
        });

        // 사용자 버튼 클릭 이벤트
        userButtons.forEach(button => {
            button.addEventListener('click', function () {
                if (this === psychologicalButton && !reason) {
                    alert('이 버튼은 현재 사용할 수 없습니다.');
                    return;
                }
                userButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // 심리 버튼 초기 상태 설정
        if (reason) {
            psychologicalButton.classList.remove('disabled');
            psychologicalButton.disabled = false;
        } else {
            psychologicalButton.classList.add('disabled');
            psychologicalButton.disabled = true;
        }
    }

    function initializeCardClickEvents() {
        cards.forEach((card) => {
            card.addEventListener('click', function () {
                if (!selectedCategory) {
                    alert('카테고리를 먼저 선택해주세요!');
                    return;
                }
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

                    // selectedCardElements[index].style.transform = `translateX(${index * 120}px)`;
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

    spreadButton.addEventListener('click', function () {
        if (!selectedCategory) {
            alert('카테고리를 먼저 선택해주세요!');
            return;
        }
        if (!isSpread) {
            toggleCardSpread();
        } else {
            shuffleCards();
        }
        updateSpreadButton();
    });

    drawAgainButton.addEventListener('click', resetCards);

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

    function shuffleCards() {
        const unselectedCards = Array.from(cards).filter(card => !selectedCards.includes(parseInt(card.getAttribute('data-card-id'))));
        for (let i = unselectedCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [unselectedCards[i].style.left, unselectedCards[j].style.left] = [unselectedCards[j].style.left, unselectedCards[i].style.left];
            [unselectedCards[i].style.transform, unselectedCards[j].style.transform] = [unselectedCards[j].style.transform, unselectedCards[i].style.transform];
        }
    }

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

    function resetCards() {
        selectedCards = [];
        selectedCardname = [];
        selectedCategory = null;
        categoryButtons.forEach(btn => btn.classList.remove('active'));

        cards.forEach((card) => {
            const cardInner = card.querySelector('.card-inner');
            cardInner.classList.remove('flipped');
            card.style.zIndex = '';
            card.style.transform = 'rotate(0deg)';
            card.style.left = '20px';
            card.style.display = '';
            card.querySelector('.card-front').innerHTML = '';
        });

        if (isSpread) {
            toggleCardSpread();
        }

        isSpread = false;

        const selectedCardElements = document.querySelectorAll('.selected-card');
        selectedCardElements.forEach((element) => {
            const selectedCardInner = element.querySelector('.selected-card-inner');
            selectedCardInner.classList.remove('flipped');
            element.querySelector('.selected-card-front').innerHTML = '';
            element.style.transform = '';
            element.style.transition = '';
        });

        spreadButton.disabled = false;
        spreadButton.textContent = '카드 펼치기';

        categoryButtons.forEach(btn => btn.classList.remove('active'));
    }

    // 초기화 함수 호출
    initializeButtons();
    initializeCardClickEvents();
    updateSpreadButton();

    function sendSelectedCardsToFlask() {
        const interpretationContent = document.getElementById('interpretationContent');
        interpretationContent.innerHTML = `
            <p>선택된 카드: ${selectedCardname.join(', ')}</p>
        `;

        const data = {
            user_select: selectedCategory,
            cards: selectedCardname
        };

        fetch('/api/interpret', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // 여기에 해석 결과를 표시하는 로직을 추가하세요
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
});