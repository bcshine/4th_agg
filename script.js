import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
import { getDatabase, ref, push, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeV7uvdevWIOY7tx4tbftqZKUoqt2DaEc",
  authDomain: "mid-ai-backend.firebaseapp.com",
  projectId: "mid-ai-backend",
  storageBucket: "mid-ai-backend.firebasestorage.app",
  messagingSenderId: "835520853350",
  appId: "1:835520853350:web:f3d544530830173f5144a7",
  databaseURL: "https://mid-ai-backend-default-rtdb.firebaseio.com/",
  measurementId: "G-LF30PLQCY8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app); // Firebase Realtime Database 초기화
const auth = getAuth(app); // Firebase Authentication 초기화

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

// ========================= 로그인 상태 관리 =========================
// 로그인 상태 확인 및 UI 업데이트
onAuthStateChanged(auth, (user) => {
    const loginBtn = document.querySelector('.login-btn');
    
    if (!loginBtn) {
        console.error('로그인 버튼을 찾을 수 없습니다.');
        return;
    }
    
    if (user) {
        // 로그인된 상태
        console.log('사용자 로그인됨:', user.email);
        
        // 로그인 버튼을 로그아웃 버튼으로 변경
        loginBtn.innerHTML = '로그아웃';
        loginBtn.href = '#';
        loginBtn.onclick = (e) => {
            e.preventDefault();
            handleLogout();
        };
        
        // 로그아웃 버튼 스타일 적용
        loginBtn.style.cssText = `
            background-color: white;
            color: black;
            border: 2px solid black;
            border-radius: 30px;
            padding: 10px 20px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.3s ease;
            display: inline-block;
        `;
        
    } else {
        // 로그아웃된 상태
        console.log('사용자 로그아웃됨');
        
        // 로그인 버튼 원래대로 복원
        loginBtn.innerHTML = '로그인';
        loginBtn.href = 'login.html';
        loginBtn.onclick = null;
        
        // 기본 스타일 확인 및 복원
        loginBtn.style.cssText = `
            background-color: white;
            color: black;
            border: 2px solid black;
            border-radius: 30px;
            padding: 10px 20px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.3s ease;
            display: inline-block;
        `;
    }
});

// 로그아웃 처리
async function handleLogout() {
    try {
        await signOut(auth);
        
        // 로컬 스토리지 정리
        localStorage.removeItem('user');
        
        // 성공 메시지 표시
        showLoginMessage('로그아웃되었습니다.', 'success');
        
        console.log('로그아웃 완료');
    } catch (error) {
        console.error('로그아웃 오류:', error);
        showLoginMessage('로그아웃 중 오류가 발생했습니다.', 'error');
    }
}

// 로그인 관련 메시지 표시
function showLoginMessage(message, type = 'info') {
    // 기존 메시지 제거
    const existingMessage = document.querySelector('.login-toast-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // 새 메시지 요소 만들기
    const messageDiv = document.createElement('div');
    messageDiv.className = 'login-toast-message';
    
    // 메시지 스타일 설정
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

    // 메시지 타입에 따른 색상 설정
    if (type === 'success') {
        messageDiv.style.background = 'linear-gradient(45deg, #00b894, #00a085)';
    } else if (type === 'error') {
        messageDiv.style.background = 'linear-gradient(45deg, #e17055, #d63031)';
    } else {
        messageDiv.style.background = 'linear-gradient(45deg, #74b9ff, #0984e3)';
    }

    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    // 애니메이션으로 메시지 나타내기
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateX(0)';
    }, 100);

    // 3초 후 메시지 사라지게 하기
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

// 전역 함수로 등록 (HTML에서 호출 가능하도록)
window.handleLogout = handleLogout;

// Q&A 섹션 JavaScript 기능
// FAQ 답변을 보이거나 숨기는 함수 - 질문을 클릭하면 답변이 나타나거나 사라짐
function toggleAnswer(element) {
    // 클릭한 질문의 다음 요소(답변)를 찾기
    const answer = element.nextElementSibling;
    
    // 답변이 현재 보이는지 확인
    if (answer.classList.contains('show')) {
        // 보이고 있다면 숨기기
        answer.classList.remove('show');
    } else {
        // 숨겨져 있다면 보이기
        answer.classList.add('show');
    }
}

// 질문 등록 폼 처리 함수
document.addEventListener('DOMContentLoaded', function() {
    const questionForm = document.getElementById('questionForm');
    if (questionForm) {
        questionForm.addEventListener('submit', function(e) {
            // 폼이 실제로 서버로 전송되는 것을 막기 (데모용)
            e.preventDefault();
            
            // 입력된 값들 가져오기
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const title = document.getElementById('title').value;
            const question = document.getElementById('question').value;
            
            // 현재 날짜 만들기
            const today = new Date();
            const dateString = today.getFullYear() + '-' + 
                             String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                             String(today.getDate()).padStart(2, '0');
            
            // 새로운 질문 HTML 만들기
            const newQuestion = `
                <div class="qna-item">
                    <div class="question">
                        <h3>${title}</h3>
                        <div class="question-meta">작성자: ${name} | 작성일: ${dateString}</div>
                        <p>${question}</p>
                    </div>
                    <div class="answer">
                        <div class="no-answer">아직 답변이 등록되지 않았습니다.</div>
                    </div>
                </div>
            `;
            
            // 질문 목록의 맨 위에 새 질문 추가하기
            const questionsList = document.getElementById('questionsList');
            questionsList.insertAdjacentHTML('afterbegin', newQuestion);
            
            // 폼 내용 지우기
            this.reset();
            
            // 성공 메시지 보여주기
            alert('질문이 성공적으로 등록되었습니다!');
        });
    }
}); 