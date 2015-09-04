---
layout: entry
type: "ToyProject"
title: "Rust 채팅 클라이언트(Kor only)"
author: hobbits
author-email: sadang.hobbits@gmail.com
description: 
publish: true
---

호빗원정대에서 선택한 두 번째 Toy Project는 Chatting Server / Client 입니다.

채팅 프로그램을 선정해 작업한 이유는 Rust의 특징을 잘 이해할 수 있는 프로젝트이기 때문입니다.
Rust는 Garbage Collector(이하 GC) 없는 메모리 관리가 대표적인 특징이지만, Multi Thread에도 유리한 언어입니다. 따라서 Rust 공식 홈페이지 Book에서도 Dining Philosophers([Link](https://doc.rust-lang.org/stable/book/dining-philosophers.html))라는 예제를 제공하기도 합니다.
지난 야구 게임은 문법에 익숙해지기 위한 것이었다면, 이번 채팅 프로그램은 Rust 언어에 대한 특징을 느낄수 있도록 구성했습니다.  

채팅 프로그램 수행 동작  
1. 클라이언트가 서동작버에 접속해 개인 ID를 부여 받음  
2. 클라이언트가 메시지를 발송하면, 서버에 접속한 모든 클라이언트에 메시지 전송  
3. 각 클라이언트는 송신자가 누구인지 확인 가능 함    

채팅 특징  
1. 클라이언트 접속 개수 제한 없음    
2. 한 번 전송가능한 메시지 글자수 제한 있음(영문/ 공백: 512자, 한글: 170자)  

채팅 클라이언트 Work Flow  
1. main 함수로 진입  
2. 서버와 TCP connection이 맺어지면 TcpStream 객체 생성  
3. TcpStream을 clone해 하나는 읽기용, 다른 하나는 쓰기용으로 사용할 준비         
4. 서버에서 오는 패킷 읽기 스레드 생성  
5. 유저가 입력한 메시지를 서버로 발송하는 Loop 시작(main thread를 그대로 활용)  

read thread와 write thread(main thread) 2개의 thread가 독립적으로 작업 수행    

코드 링크   
[Chatting Client(Github)](https://github.com/wooq17/rust_study/blob/master/chatting_client/src/main.rs)  