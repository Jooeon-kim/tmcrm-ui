# TM UI (Redux + Router + Axios)

## 설치
```bash
npm install
```

## 실행
```bash
npm run dev
```

## API URL 설정
`src/api/client.js`의 `API_BASE_URL`을 Apps Script 웹앱 `/exec` URL로 교체하세요.

## CRUD 안될 때(중요)
Apps Script 웹앱은 브라우저에서 JSON POST가 CORS/프리플라이트로 막히는 경우가 많습니다.
그래서 이 프로젝트는 **수정(update)을 GET 파라미터 방식**으로 보내도록 수정했습니다.
- 읽기: GET action=leads
대로
- 저장: GET action=update (leadId/eventType/status/memo/reservationOrVisitAt/callDateTime)

## 추가 기능
- 예약일시: 모달에서 '달력' 버튼 → 날짜 선택 + 시간(30분 단위)
- 상담가능 표시: 상담가능시간이 현재시간 포함이면 카드 좌측에 파란 글씨 '상담가능'
