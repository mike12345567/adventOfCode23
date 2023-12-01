use serde::Deserialize;
use std::fs::File;
use std::io::Read;

#[derive(Debug, Deserialize)]
struct InputData {
  data: Vec<String>,
}

fn find(input: &str) -> (Option<u32>, Option<u32>) {
  let mut first: Option<u32> = None;
  let mut last: Option<u32> = None;

  for c in input.chars() {
    if c.is_numeric() {
      let digit = c.to_digit(10).unwrap();
      if first.is_none() {
        first = Some(digit);
      }
      last = Some(digit);
    }
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
        println!("Nothing to do");
      }
    }
  }
  println!("The sum is: {}", sum);
}
