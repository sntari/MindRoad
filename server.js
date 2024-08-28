// express 모듈 불러오기
// express : node.js에서 웹 어플리케이션 구축할때 사용하는 프레임워크
// 서버설정, 라우팅, 미들웨어 처리 기능 제공
const express = require('express');

// ejs의 레이아웃기능을 제공하여 유지보수에 용이
const expressLayouts = require('express-ejs-layouts')

// 세션 관리를 위한 미들웨어
// 사용자별 세션 데이터를 서버에 저장 
// 세션 ID를 쿠키로 클라이언트에 전달하여 상태를 유지
var session = require('express-session');
const path = require('path');
var cookieParser = require('cookie-parser');

//  Express에서 HTTP 요청의 본문(body)을 파싱하는 미들웨어
// 주로 POST 요청의 본문 데이터를 처리
var bodyParser = require('body-parser');

// express 객체 생성
const app = express();

// 세션 설정
app.use(session({
  secret: 'MindRoad',
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: false, // HTTPS를 사용하지 않는 경우 false로 설정
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(cookieParser('MindRoad'));

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// ejs를 템플릿 엔진으로 사용하도록 설정
app.use(expressLayouts);

// ejs를 템플릿 엔진으로 사용하도록 설정
app.set('view engine', 'ejs');
app.set('layout', 'template');
// 뷰 템플릿 파일이 위치한 디렉토리를 public으로 설정
app.set('views', path.join(__dirname, 'public', 'views'));

// 정적 파일을 제공하기 위한 미들웨어 설정
app.use(express.static(path.join(__dirname, 'public')));

// POST 요청 본문을 파싱하기 위한 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));
// HTTP 요청의 body에서 JSON 형식으로 전송된 데이터를 파싱(parsing)하여 JavaScript 객체로 만들어주는 역할 
app.use(bodyParser.json());

// 로그인 관련 라우터
const memberRoutes = require('./routes/MemberRoutes');
app.use('/member', memberRoutes);

const myPageRoutes = require('./routes/myPageRoutes');
app.use('/mypage', myPageRoutes);

// 메인페이지
app.get('/', (req, res) => {
  if (req.session.user) {
    res.render('template', { user: req.session.user, title: '유저있음' });
  } else {
    res.render('template', { user: null, title: '유저없음' });
  }
});

app.listen(3300, () => {
  console.log(`서버 가동`);
});


// 기존 코드 아래에 추가

// 타로 카드 페이지 라우트
app.get('/tarot', (req, res) => {
  res.render('tarot', { 
    title: '타로 카드', 
    layout: 'template',
    user: req.session.user 
  });
});
