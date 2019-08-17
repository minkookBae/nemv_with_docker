# nemv3
node express mongo vue
## reference
[https://fkkmemi.github.io] fkkmemi 님 블로그의 모던웹 제작 강좌<br>
[https://github.com/jamesaud/VENoM-Docker/] jamesaud 님의 VENoM-Docker 설정


## config 파일 세팅 방법

**be/config/index.js**  
```javascript
module.exports = {
    dbUrl: `mongodb://${process.env.DATABASE_URL}/nemv`, //도커용
    dbUrl2: 'mongodb://localhost:27017/nemv', //로컬용
    admin: {
      id: 'admin',
      pwd: '1234',
      name: '관리자'
    },
    jwt: {
      secretKey: 'qazwsxedc',
      issuer: 'xxx.com',
      subject : 'logintoken',
      algorithm: 'HS256',    
      expiresIn: 60 * 60, // 기본 60분
      expiresInRemember: 60 * 60 * 24 * 6, // 기억하기 눌렀을 때 6일
      expiresInDiv: 3 // 토큰시간 나누는 기준
    }
  }
```
이런식으로 디비 연결 문자열을 작성해야 웹서버가 정상 구동됨.

**fe/config/index.js**
```javascript
module.exports = {
  host_URL : 'http://YOUR_HOST_URL' //vm의 경우 포트포워딩도 해주세요.!! PORT 3000,8080,27017 을 각각 3000,8080,27017로...
  }

```

프론트엔드 컨테이너와 백엔드 컨테이너를 연결(?) ((느낌이 POD간이 아닌, 외부 통신하는 것 같음.))



## how to start
### before start, you should make configure files.



### for docker
```
git clone https://github.com/minkookbae/nemv_with_docker
```
```
cd nemv_with_docker
```

```
docker-compose build
```

```
docker-compose up
```
```
docker-compose up -d  //for background
```


### for local<br>(windows . if you use linux or mac, you should change package.json file script SET(delete needed) )

```
cd nemv_with_docker
```
```
cd fe && yarn && cd ../be && yarn
```
```
mongod
```
```
(new prompt)yarn dev2
```
```
(new prompt)yarn serve2
```


##
※ package.json have [development2 ] with space at last.

## your app will be running on docker(example.. vm) or local
[http://YOUR_HOST_URL:8080] : docker
<br>
[http://localhost:8080] : local


## TODO List
- [x] 회원가입
- [x] 로그인(jwt를 이용한)
- [x] 관리페이지 구현(fkkmemi님의 예제)
- [x] 이슈 게시판 구현
- [x] 도움 주신 분 구현
- [x] 이슈 상세 페이지 구현
- [x] 이슈 댓글 구현
- [x] 좋아요, 싫어요 구현
- [x] 이슈 오픈, 클로즈 구현
- [ ] 라벨링 구현
- [ ] 필터링 구현
- [ ] 게시판 정렬 구현
