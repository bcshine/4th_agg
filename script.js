// ========================= 헤더 모바일 메뉴 기능 =========================
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    if (mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
    } else {
        mobileNav.classList.add('active');
    }
}

function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.remove('active');
}

// 화면 크기 변경 시 모바일 메뉴 자동 닫기
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

// 메뉴 외부 클릭 시 모바일 메뉴 닫기
document.addEventListener('click', function(event) {
    const mobileNav = document.getElementById('mobileNav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (!mobileNav.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
        closeMobileMenu();
    }
});

// ========================= 히어로 슬라이더 기능 =========================
let currentSlide = 0;
const totalSlides = 3;
let autoSlideTimer;

function nextSlide() {
    goToSlide((currentSlide + 1) % totalSlides);
}

function previousSlide() {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
}

function goToSlide(slideIndex) {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-indicator');
    
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    slides[slideIndex].classList.add('active');
    indicators[slideIndex].classList.add('active');
    
    currentSlide = slideIndex;
    resetAutoSlide();
}

function startAutoSlide() {
    autoSlideTimer = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
    if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
    }
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

// 자동 슬라이드 시작
document.addEventListener('DOMContentLoaded', function() {
    startAutoSlide();
});

// 마우스 호버 시 자동 슬라이드 정지/재시작
document.querySelector('.hero-section').addEventListener('mouseenter', function() {
    stopAutoSlide();
});

document.querySelector('.hero-section').addEventListener('mouseleave', function() {
    startAutoSlide();
});

// 키보드 화살표 키로 슬라이드 제어
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        previousSlide();
    } else if (event.key === 'ArrowRight') {
        nextSlide();
    }
});

// ========================= 터치 스와이프 기능 =========================
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.hero-section').addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
});

document.querySelector('.hero-section').addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    
    if (touchEndX < touchStartX - swipeThreshold) {
        nextSlide();
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
        previousSlide();
    }
}

// ========================= 부드러운 스크롤 네비게이션 =========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================= 연락처 클릭 이벤트 =========================
document.addEventListener('DOMContentLoaded', function() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const text = item.querySelector('span').textContent;
            
            if (text.includes('02-')) {
                if (confirm('전화를 걸까요?\n' + text)) {
                    window.location.href = 'tel:' + text.replace(/-/g, '');
                }
            }
            else if (text.includes('@')) {
                if (confirm('이메일을 보낼까요?\n' + text)) {
                    window.location.href = 'mailto:' + text;
                }
            }
            else if (text.includes('서울')) {
                if (confirm('지도에서 위치를 확인할까요?\n' + text)) {
                    window.open('https://map.naver.com/v5/search/' + encodeURIComponent(text), '_blank');
                }
            }
        });
    });
});

// ========================= 페이지 로딩 완료 메시지 =========================
window.addEventListener('load', function() {
    console.log('중간계 AI 스튜디오 통합 웹사이트 로딩 완료!');
});

// ========================= Q&A 기능 (초등학생용 주석: 웹페이지가 움직이게 하는 코드) =========================
document.addEventListener('DOMContentLoaded', function() {
    // 필요한 요소들을 찾아서 변수에 저장 (초등학생용 주석)
    const qnaForm = document.getElementById('qnaForm'); // 질문 입력 폼 찾기
    const qnaList = document.getElementById('qnaList'); // 질문 목록 영역 찾기
    const qnaData = []; // 질문들을 저장할 배열 만들기

    // Q&A 폼이 존재하는지 확인
    if (qnaForm && qnaList) {
        // 폼 제출 이벤트 리스너 (초등학생용 주석: 질문 등록 버튼을 눌렀을 때 실행)
        qnaForm.addEventListener('submit', function(e) {
            e.preventDefault(); // 페이지 새로고침 방지 (초등학생용 주석)
            
            // 입력된 질문과 답변 가져오기 (초등학생용 주석)
            const questionInput = document.getElementById('question');
            const adminAnswerInput = document.getElementById('adminAnswer');
            const question = questionInput.value.trim(); // 질문 내용 (앞뒤 공백 제거)
            const adminAnswer = adminAnswerInput ? adminAnswerInput.value.trim() : ''; // 관리자 답변 내용
            
            // 질문이 비어있지 않으면 실행 (초등학생용 주석)
            if (question) {
                // 새 질문 데이터 만들기 (초등학생용 주석)
                const newQnA = {
                    question: question, // 질문 내용
                    answer: adminAnswer || '관리자가 답변을 준비 중입니다.', // 답변 (없으면 기본 메시지)
                    timestamp: new Date().toLocaleString('ko-KR'), // 등록 시간
                    isCustomAnswer: !!adminAnswer // 관리자가 직접 답변했는지 확인
                };
                
                // 질문 배열에 추가 (초등학생용 주석)
                qnaData.unshift(newQnA); // 맨 앞에 추가 (최신 질문이 위에 오도록)
                
                // 화면에 질문 목록 다시 그리기 (초등학생용 주석)
                renderQnA();
                
                // 입력 폼 초기화 (초등학생용 주석: 입력창 비우기)
                qnaForm.reset();
                
                // 성공 메시지 보여주기 (초등학생용 주석)
                showQnAMessage('질문이 성공적으로 등록되었습니다! 🎉', 'success');
                
                // 개발자 도구에 로그 출력 (초등학생용 주석)
                console.log('새 질문이 등록되었습니다:', question);
            }
        });

        // 질문 목록을 화면에 그리는 함수 (초등학생용 주석)
        function renderQnA() {
            qnaList.innerHTML = ''; // 기존 내용 지우기
            
            // 질문이 없으면 안내 메시지 표시 (초등학생용 주석)
            if (qnaData.length === 0) {
                qnaList.innerHTML = '<div class="empty-message">아직 등록된 질문이 없습니다. 첫 번째 질문을 남겨보세요! 😊</div>';
                return;
            }
            
            // 각 질문을 화면에 표시 (초등학생용 주석)
            qnaData.forEach((item, index) => {
                const qnaItem = document.createElement('div'); // 새 div 요소 만들기
                qnaItem.className = 'qna-item'; // CSS 클래스 추가
                
                // 질문 카드 내용 만들기 (초등학생용 주석)
                qnaItem.innerHTML = `
                    <div class="question">Q${qnaData.length - index}. ${item.question}</div>
                    <div class="answer">A. ${item.answer}</div>
                    <div class="timestamp">등록일: ${item.timestamp}</div>
                `;
                
                // 관리자 직접 답변인 경우 특별한 스타일 적용 (초등학생용 주석)
                if (item.isCustomAnswer) {
                    qnaItem.style.background = 'linear-gradient(135deg, #00b894 0%, #00a085 100%)';
                }
                
                qnaList.appendChild(qnaItem); // 목록에 추가
            });
        }

        // 메시지를 보여주는 함수 (초등학생용 주석)
        function showQnAMessage(message, type = 'info') {
            // 기존 메시지 제거 (초등학생용 주석)
            const existingMessage = document.querySelector('.toast-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            // 새 메시지 요소 만들기 (초등학생용 주석)
            const messageDiv = document.createElement('div');
            messageDiv.className = 'toast-message';
            
            // 메시지 스타일 설정 (초등학생용 주석)
            messageDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 10px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
                max-width: 350px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                font-family: 'Noto Sans KR', sans-serif;
            `;

            // 메시지 타입에 따른 색상 설정 (초등학생용 주석)
            if (type === 'success') {
                messageDiv.style.background = 'linear-gradient(45deg, #00b894, #00a085)';
            } else if (type === 'error') {
                messageDiv.style.background = 'linear-gradient(45deg, #e17055, #d63031)';
            } else {
                messageDiv.style.background = 'linear-gradient(45deg, #74b9ff, #0984e3)';
            }

            messageDiv.textContent = message; // 메시지 내용 설정
            document.body.appendChild(messageDiv); // 페이지에 추가

            // 애니메이션으로 메시지 나타내기 (초등학생용 주석)
            setTimeout(() => {
                messageDiv.style.opacity = '1';
                messageDiv.style.transform = 'translateX(0)';
            }, 100);

            // 3초 후 메시지 사라지게 하기 (초등학생용 주석)
            setTimeout(() => {
                messageDiv.style.opacity = '0';
                messageDiv.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.parentNode.removeChild(messageDiv);
                    }
                }, 300);
            }, 3000);
        }

        // 초기 질문 목록 그리기 (초등학생용 주석)
        renderQnA();
        console.log('Q&A 페이지가 준비되었습니다!'); // 개발자 도구에 메시지 출력
    }
}); 