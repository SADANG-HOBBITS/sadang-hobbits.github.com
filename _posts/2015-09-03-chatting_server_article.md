---
layout: entry
type: "ToyProject"
title: "Rust 채팅 서버(Kor only)"
author: hobbits
author-email: sadang.hobbits@gmail.com
description: 
publish: true
---

지난번 Chatting Client에 이어 Server에 대해서 정리하겠습니다.  

서버는 그래도 서버니까 클라이언트에 비해 복잡하게 느껴지는데요. 실제로 코드가 100줄 정도 더 많습니다. 하지만 클라이언트와 겹치는 코드가 대부분이라 생각보다 쉽게 읽힌다고 느끼실 것입니다. 앞에서 읽었던 클라이언트 코드가 잘 기억나지 않으신다고요? 다시 한 번 다녀오시는 것이 더 빠른 학습 방법입니다. ([Client Code](https://github.com/wooq17/rust_study/blob/master/chatting_client/src/main.rs))  

본격적으로 서버 이야기를 해볼까요? 앞서도 이야기 했듯 Rust 채팅 서버의 클라이언트 접속 최대 개수는 정해지지 않았습니다. 즉, OS가 허용하는 개수까지 접속 가능하다는 것이죠. 참고 "([Connection 개수](http://www.sysnet.pe.kr/2/0/964))"   
또 채팅 가능한 글자수 제한이 있는데요. 이는 스트림에서 받은 데이터의 크기를 검증하는 과정에 사용하는 Buffer의 크기가 결정되어 있기 때문입니다. 현재는 512byte로 설정되어 있습니다. 패킷에서 정의한 길이 만큼 데이터를 전송 받지 못했다면, 이전 데이터를 버퍼에 임시 저장하게 됩니다.  

서버의 thread 개수는 연결되는 클라이언트 개수로 결정됩니다. 접속하는 클라이언트 개수를 n으로 치면 n + 2 개 입니다. 각각의 thread는 다음과 같습니다.  
1. connection을 확인하는 main thread(1개)  
2. 전체 채팅 그룹(클라이언트 그룹)을 managing하는 thread(1개)  
3. 각 클라이언트가 보내는 메시지를 받는 thread(n개)  

!!!채널을 사용, 채널에 대한 소개 추가 필요    

채팅 서버 Work Flow  
1. m) main 함수로 진입  
2. m) 지정된 ip와 port를 TcpListener에 binding  
3. m) 신규 Chat Group을 만들고(initialize), Chat Group에 있는 Channel 송신부(transmitter)를 하나 Clone해 가져옴      
4. m) Chat Group을 managing 하는 thread를 생성(8번으로 이동)  
5. m) TcpLister에 접속 요청이 들어오면 TcpStream을 만듦  
6. m) 신규 TcpStream을 포함하는 새로운 Client 객체를 만들어 3번에서 준비한 Channel transmitter에 newClient Signal 발송  
7. m) 다음 접속 요청까지 대기 후 접속시 5번부터 반복   
8. c) Chat Group에 Implement된 cycle 함수(loop) 실행  
9. c) cycle 함수는 Channel 수신부(receive)에서 송신부를 통한 내부 Signal을 기다림  
10. c) 수신 받은 내부 Signal에 따라 각각의 프로세스 진행  
11. c) NewClient Signal 경우 새로운 id를 발급해 클라이언트에 발송 및 Chat Group에 해당 클라이언틀 등록한 다음 read client stream thread 생성(14번으로 이동)   
12. c) NewMessage Signal 경우 현재 Chat Group에 등록되어 있는 모든 클라이언트를 순회하며 메시지 발송  
13. c) Close Signal 경우 Chat Group에 등록되어 있는 클라이언트 중 자신의 클라이언트를 찾아 제거     
14. c) chat group Thread 반복   
14. r) clinet cycle 함수(loop) 실행    
15. r) read message 함수부터는 클라이언트의 read message와 동일  
16. r) client read thread 반복    

- thread 설명 
m : Main Thread  
c : Chat Group Thread  
r : Client Read Thread  

코드 링크   
[Chatting Server(Github)](https://github.com/wooq17/rust_study/blob/master/chatting_server/src/main.rs)  