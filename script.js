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

// ========================= Q&A 기능 with Firebase (초등학생용 주석: 웹페이지가 움직이게 하는 코드) =========================
document.addEventListener('DOMContentLoaded', function() {
    // 필요한 요소들을 찾아서 변수에 저장 (초등학생용 주석)
    const qnaForm = document.getElementById('qnaForm'); // 질문 입력 폼 찾기
    const qnaList = document.getElementById('qnaList'); // 질문 목록 영역 찾기
    let qnaData = []; // 질문들을 저장할 배열 만들기

    // Firebase 데이터베이스 참조 생성 (초등학생용 주석: Firebase에서 데이터를 저장할 위치 정하기)
    const qnaRef = ref(database, 'qna');

    // Q&A 폼이 존재하는지 확인
    if (qnaForm && qnaList) {
        
        // Firebase에서 실시간으로 Q&A 데이터 불러오기 (초등학생용 주석)
        onValue(qnaRef, (snapshot) => {
            const data = snapshot.val();
            qnaData = [];
            
            if (data) {
                // Firebase 데이터를 배열로 변환 (초등학생용 주석)
                Object.keys(data).forEach(key => {
                    qnaData.push({
                        id: key,
                        ...data[key]
                    });
                });
                
                // 최신 순으로 정렬 (초등학생용 주석)
                qnaData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
            
            // 화면에 질문 목록 다시 그리기 (초등학생용 주석)
            renderQnA();
            console.log('Firebase에서 Q&A 데이터를 불러왔습니다:', qnaData.length + '개');
        });

        // 폼 제출 이벤트 리스너 (초등학생용 주석: 질문 등록 버튼을 눌렀을 때 실행)
        qnaForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // 페이지 새로고침 방지 (초등학생용 주석)
            
            // 입력된 질문과 답변 가져오기 (초등학생용 주석)
            const questionInput = document.getElementById('question');
            const adminAnswerInput = document.getElementById('adminAnswer');
            const question = questionInput.value.trim(); // 질문 내용 (앞뒤 공백 제거)
            const adminAnswer = adminAnswerInput ? adminAnswerInput.value.trim() : ''; // 관리자 답변 내용
            
            // 질문이 비어있지 않으면 실행 (초등학생용 주석)
            if (question) {
                try {
                    // 버튼 비활성화 (중복 제출 방지)
                    const submitBtn = qnaForm.querySelector('button[type="submit"]');
                    submitBtn.disabled = true;
                    submitBtn.textContent = '등록 중...';
                    
                    // 새 질문 데이터 만들기 (초등학생용 주석)
                    const newQnA = {
                        question: question, // 질문 내용
                        answer: adminAnswer || '관리자가 답변을 준비 중입니다.', // 답변 (없으면 기본 메시지)
                        timestamp: new Date().toLocaleString('ko-KR'), // 등록 시간 (화면 표시용)
                        createdAt: new Date().toISOString(), // 정렬용 ISO 시간
                        isCustomAnswer: !!adminAnswer, // 관리자가 직접 답변했는지 확인
                        userAgent: navigator.userAgent.substring(0, 100) // 사용자 환경 정보 (간단히)
                    };
                    
                    // Firebase에 데이터 저장 (초등학생용 주석: 클라우드에 질문 저장하기)
                    await push(qnaRef, newQnA);
                    
                    // 입력 폼 초기화 (초등학생용 주석: 입력창 비우기)
                    qnaForm.reset();
                    
                    // 성공 메시지 보여주기 (초등학생용 주석)
                    showQnAMessage('질문이 Firebase에 성공적으로 저장되었습니다! 🎉', 'success');
                    
                    // 개발자 도구에 로그 출력 (초등학생용 주석)
                    console.log('새 질문이 Firebase에 저장되었습니다:', question);
                    
                } catch (error) {
                    // 오류 처리 (초등학생용 주석: 문제가 생겼을 때 알려주기)
                    console.error('Firebase 저장 오류:', error);
                    showQnAMessage('질문 저장 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
                } finally {
                    // 버튼 다시 활성화
                    const submitBtn = qnaForm.querySelector('button[type="submit"]');
                    submitBtn.disabled = false;
                    submitBtn.textContent = '질문 등록하기';
                }
            }
        });

        // 질문 목록을 화면에 그리는 함수 (초등학생용 주석)
        function renderQnA() {
            qnaList.innerHTML = ''; // 기존 내용 지우기
            
            // 질문이 없으면 안내 메시지 표시 (초등학생용 주석)
            if (qnaData.length === 0) {
                qnaList.innerHTML = `
                    <div class="empty-message">
                        <div style="font-size: 1.2rem; margin-bottom: 10px;">🔥 실시간 Firebase 연결됨!</div>
                        아직 등록된 질문이 없습니다. 첫 번째 질문을 남겨보세요! 😊
                    </div>
                `;
                return;
            }
            
            // 각 질문을 화면에 표시 (초등학생용 주석)
            qnaData.forEach((item, index) => {
                const qnaItem = document.createElement('div'); // 새 div 요소 만들기
                qnaItem.className = 'qna-item'; // CSS 클래스 추가
                
                // 질문 카드 내용 만들기 (초등학생용 주석)
                qnaItem.innerHTML = `
                    <div class="question">Q${index + 1}. ${item.question}</div>
                    <div class="answer">A. ${item.answer}</div>
                    <div class="timestamp">
                        등록일: ${item.timestamp}
                        <span style="margin-left: 10px; font-size: 0.8rem; opacity: 0.7;">
                            🔥 Firebase ID: ${item.id ? item.id.substring(0, 8) : 'local'}...
                        </span>
                    </div>
                `;
                
                // 관리자 직접 답변인 경우 특별한 스타일 적용 (초등학생용 주석)
                if (item.isCustomAnswer) {
                    qnaItem.style.background = 'linear-gradient(135deg, #00b894 0%, #00a085 100%)';
                    // 관리자 답변 표시 추가
                    const answerDiv = qnaItem.querySelector('.answer');
                    answerDiv.innerHTML = `A. ${item.answer} <span style="font-size: 0.8rem; opacity: 0.8;">✨ 관리자 직접 답변</span>`;
                }
                
                qnaList.appendChild(qnaItem); // 목록에 추가
            });
            
            // Firebase 연결 상태 표시
            const statusDiv = document.createElement('div');
            statusDiv.style.cssText = `
                text-align: center;
                margin-top: 20px;
                padding: 10px;
                background: linear-gradient(45deg, #00b894, #00a085);
                color: white;
                border-radius: 8px;
                font-size: 0.9rem;
            `;
            statusDiv.innerHTML = `🔥 Firebase 실시간 연결 활성화 | 총 ${qnaData.length}개 질문 로드됨`;
            qnaList.appendChild(statusDiv);
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

        // Firebase 연결 상태 확인 (초등학생용 주석)
        console.log('🔥 Firebase Q&A 시스템이 준비되었습니다!');
        showQnAMessage('🔥 Firebase 실시간 데이터베이스에 연결되었습니다!', 'info');
    }
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