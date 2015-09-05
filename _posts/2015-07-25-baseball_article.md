---
layout: entry
type: "ToyProject"
title: "야구 게임으로 Rust Language 시작하기(Kor)"
author: hobbits
image: baseball.png
description: 
publish: true
---

호빗원정대 그룹에서 처음으로 작성한 코드입니다.  
처음 Rust를 공부할 때, 기초적인 문법들을 활용하면서 간단한 로직을 수행하는([guessing game](https://doc.rust-lang.org/stable/book/guessing-game.html)과 같은) 예제 코드가 있으면 도움이 될 것 같아서 시작했습니다.

야구 게임은 다음과 같은 룰을 가지고 작성했습니다.

1. 게임에 사용되는 숫자의 범위는 1 ~ 9
2. 플레이어의 시도 횟수 제한은 없음 (시도횟수를 스코어로 간주)
3. 게임을 한 번 완료하면 프로그램은 종료
4. 사용자 입력의 구분자는 space (예: "1 2 3")
5. 사용자가 입력한 포맷이 유효하지 않은 경우에는 시도횟수를 증가시키지 않고 다시 입력 받는다
6. 사용자가 한번에 같은 숫자를 입력할 경우에는 유효하지 않은 포맷은 간주 (예: 1 1 2) 
7. 이미 입력했던 값과 같은 값을 입력할 경우를 구분해서 처리하지 않음 - 같은 결과 반환

{% highlight rust %}
use std::io;

extern crate rand;

const INPUT_NUMBER_COUNT: usize = 3;

/// [플레이어가 맞춰야 할 숫자 생성]
/// 3개의 1 ~ 9 사이의 서로 다른 무작위 숫자 생성 후 Vector로 반환
/// return: 8bit unsigned Vector
fn generate_answer() -> Vec<u8> {
	let mut answer: Vec<u8> = Vec::new();

	// Vector 크기는 항상 INPUT_NUMBER_COUNT로 고정
	while answer.len() < INPUT_NUMBER_COUNT {
		let rand_number = rand::random::<u8>() % 9 + 1;

		// 생성한 랜덤 숫자와 같은 숫자가 이미 포함되어 있는지 answer를 순회하면서 검사 
		// reference: https://doc.rust-lang.org/stable/book/closures.html
		match answer.iter().find(|x| **x == rand_number) {
			Some(_) => {},	
			None => answer.push(rand_number),
		}
	}

	answer
}

/// [플레이어 입력 처리]
/// 키보드 입력을 받고 비교 가능한 숫자로 변환 후 Vector를 포함한 Result type으로 반환
/// return: Result type < Vector, 문자열 >
/// Result 추가 정보: https://doc.rust-lang.org/std/result/
fn get_user_input() -> Result<Vec<u8>, &'static str> {
	// 플레이어 입력을 받아 str Vector에 입력
	let mut input: String = String::new();
	io::stdin().read_line(&mut input);
	let input_numbers: Vec<&str> = input.trim().split(' ').collect();

	// 입력받은 숫자 개수를 확인
	if input_numbers.len() == INPUT_NUMBER_COUNT {	
		let mut converted_number_list:Vec<u8> = Vec::new();

		for each_number_str in input_numbers {
			// 입력 Vector를 순회하며 10진수로 변환
			match u8::from_str_radix(each_number_str, 10) {
				Ok(num) => { converted_number_list.push(num); },
				Err(_) => { return Err("invalid number format"); },
			};
		}

		Ok(converted_number_list)
	} else {
		Err("invalid input number")
	}
}

/// [게임 로직 함수]
/// 무작위로 생성되는 숫자 그룹과 플레이어가 입력한 숫자 그룹 간 비교 후 튜플로 반환
/// parameter1 answer: 무작위 생성 숫자 Vector reference
/// parameter2 input_numbers: 사용자 입력 숫자 Vector reference
/// return: 8bit unsigned int tuple
fn compare_user_input_with_answer(answer: &Vec<u8>, input_numbers: &Vec<u8>) -> (u8, u8) {
	let mut strike = 0;
	let mut ball = 0;

	// enumerate()로 생성한 index와 Vector 요소를 순회하면서 검사
	for (idx, each_number) in input_numbers.iter().enumerate() {
		// answer vector 내부를 순회하며 find closure에서 비교
		// reference: https://doc.rust-lang.org/stable/book/closures.html
		match answer.iter().find(|&x| *x == *each_number) {
			Some(_) => {
				// 숫자도 같고 index 위치도 같으면 strike
				if answer[idx] == *each_number { strike += 1; }
				else { ball += 1; }
			},
			None => {},
		}
	}

	(strike, ball)
}

/// [입력 오류 안내 출력]
/// parameter1 message: 오류 원인
fn print_input_error_message(message: &str) {
	println!("{}", message);

	println!("check your input format");
	println!("input format : number number number");
	println!("example : 1 2 3");
}

/// [main loop]
fn main() {
	// 정답 생성
	let answer = generate_answer();
	
	// 전체 시도 횟수를 최종 점수로 표시
	let mut turn = 0;
	println!(">>> Game started...");

	loop {
		println!("[turn : {}] Input your answer", turn);

		// 유저 입력값 3개를 담은 Vector를 가져온다
		let user_input = match get_user_input() {
			Ok(input) => input,
			Err(message) => {
				print_input_error_message(message);
				continue;
			}
		};

		// 입력 처리가 정상적으로 완료되면, 시도 횟수 1번 증가
		turn += 1;

		// 정답과 플레이어 입력값을 비교해 결과 출력
		let (strike, ball) = compare_user_input_with_answer(&answer, &user_input);

		println!("[turn : {}] strike : {}, ball : {}\n", turn, strike, ball);

		// 게임 종료
		if strike == INPUT_NUMBER_COUNT as u8 { 
			println!("clear!\nyour score : {} turn", turn);
			return; 
		}
	}
}
{% endhighlight %}

[English version](https://github.com/SADANG-HOBBITS/BaseballGame/blob/master/src/main_eng.rs)

만약 위의 룰을 만족하는 더 좋은 코드가 있다고 생각되면 추가할 수 있게, 메일을 보내거나 pull request를 보내주세요.
>>>>>>> c085472967eb0303d6fd6ad2f4bd21923ca7d2a6
