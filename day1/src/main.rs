use serde::Deserialize;
use std::fs::File;
use std::io::Read;

static NUMBER_WORDS: [&'static str; 9] = [
  "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
];

#[derive(Debug, Deserialize)]
struct InputData {
  data: Vec<String>,
}

fn index_word(input: &str) -> Option<u32> {
  let mut index: Option<u32> = None;
  if let Some(_index) = NUMBER_WORDS.iter().position(|&x| x == input) {
    index = Some(_index as u32 + 1);
  }
  return index;
}

fn find(input: &str) -> (Option<u32>, Option<u32>) {
  let mut first: Option<u32> = None;
  let mut last: Option<u32> = None;
  let mut first_index: Option<u32> = None;
  let mut last_index: Option<u32> = None;

  for num_word in NUMBER_WORDS {
    if let Some(_index) = input.find(num_word) {
      if first.is_none() || first_index > Some(_index as u32) {
        first_index = Some(_index as u32);
        first = index_word(num_word);
      }
      if last.is_none() || last_index < Some(_index as u32) { 
        last_index = Some(_index as u32);
        last = index_word(num_word);
      }
    }
  }
  
  let mut index = 0;
  for c in input.chars() {
    if c.is_numeric() {
      let digit = c.to_digit(10).unwrap();
      if first.is_none() || (!first_index.is_none() && index < first_index.unwrap()) {
        first = Some(digit);
      }
      if last_index.is_none() || (!last_index.is_none() && index > last_index.unwrap()) {
        last = Some(digit);
      }
    }
    index += 1;
  }

  if first.is_none() {
    first = last
  }

  (first, last)
}

fn main() {
  let file_path = "./inputs.json";
  let mut file = File::open(file_path).expect("Failed to open file");
  let mut contents = String::new();
  file
    .read_to_string(&mut contents)
    .expect("Failed to read file contents");

  let input: InputData = serde_json::from_str(&contents).expect("Failed to deserialize JSON");
  let calibrations = &input.data;

  let mut sum: u32 = 0;
  for element in calibrations {
    let (first, last) = find(element);
    match (first, last) {
      (Some(first), Some(last)) => {
        let string = format!("{}{}", first, last);
        sum += string.parse::<u32>().unwrap();
      }
      _ => {
        println!("Nothing to do: {}", element);
      }
    }
  }
  println!("The sum is: {}", sum);
}
