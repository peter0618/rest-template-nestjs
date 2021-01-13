## 사용자 중복 등록 방지 테스트

iterm 실행 후,
* cmd + d : 창 추가
* option + cmd + i : keyboard input 미러링

으로 셋팅한 뒤, shell 에서 아래와 같이 휴대폰이 같은 사용자 생성 요청 

```
> curl -d '{"name":"James", "phone":"010-1234-5678"}' -H "Content-Type: application/json" -X POST http://localhost:3001/users
```
기존에 DB에 전화번호가 "010-1234-5678"인 사용자가 없는 상태에서 위와 같이 요청하면 하나의 요청만 성공하고, 나머지 요청에 대해서는 실패합니다.
