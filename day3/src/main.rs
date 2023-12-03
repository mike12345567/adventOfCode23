use regex::Regex;
use std::fs::File;
use std::io::{self, Read};

fn read_file() -> io::Result<Vec<String>> {
  let file_path = "./input.txt";
  let mut file = File::open(file_path)?;
  let mut contents = String::new();
  file.read_to_string(&mut contents)?;
  let lines: Vec<String> = contents.lines().map(String::from).collect();
  Ok(lines)
}

fn get_str(line: &Vec<char>, mut start: i32, mut end: u32) -> String {
  if start < 0 {
    start = 0;
  }
  if end >= (line.len() as u32) {
    end = line.len() as u32 - 1;
  }
  let char_slice: Vec<char> = line[start as usize..=end as usize].to_vec();
  let char_string: String = char_slice.iter().collect();
  return char_string;
}

fn get_number(line: &Vec<char>, start: u32, end: u32) -> u32 {
  let char_string = get_str(line, start as i32, end);
  println!("{}", char_string);
  let result: Result<u32, _> = char_string.trim_end_matches(".").parse();
  return result.unwrap();
}

fn main() -> io::Result<()> {
  let lines = read_file()?;

  let rows = lines.len();
  let cols = lines[0].len();
  let mut characters: Vec<Vec<char>> = vec![vec![' '; cols]; rows];

  let mut line_index: u32 = 0;
  for line in lines {
    let mut index: u32 = 0;
    for char in line.chars() {
      characters[line_index as usize][index as usize] = char;
      index = index + 1;
    }
    line_index = line_index + 1;
  }

  let symbols = Regex::new(r#"[^a-zA-Z0-9.\s]+"#).unwrap();

  let max_rows = characters.len();
  let mut sum = 0;
  for (i, line) in characters.iter().enumerate() {
    let max_line_len = line.len() as u32;
    let mut started = false;
    let mut start_idx = 0;
    let mut ended = false;
    let mut end_idx = 0;
    for (j, el) in line.iter().enumerate() {
      let line_end = j as u32 == max_line_len - 1;
      if el.is_digit(10) && !started {
        started = true;
        start_idx = j as u32;
      }
      if started && (!el.is_digit(10) || line_end) {
        ended = true;
        end_idx = if line_end { j as u32 } else { j as u32 - 1 };
      }
      // on the character after some numbers
      if started && ended {
        // check before, after, and then characters in line above and below
        let before_or_after = (start_idx > 0
          && symbols.is_match(&line[(start_idx - 1) as usize].to_string()))
          || (end_idx < max_line_len && symbols.is_match(&el.to_string()));
        let above = if i > 0 {
          get_str(&characters[i - 1], start_idx as i32 - 1, end_idx + 1)
        } else {
          "".to_string()
        };
        let below = if i < max_rows - 1 {
          get_str(&characters[i + 1], start_idx as i32 - 1, end_idx + 1)
        } else {
          "".to_string()
        };
        if symbols.is_match(&above) || symbols.is_match(&below) || before_or_after {
          let numb = get_number(&line, start_idx, end_idx);
          sum = sum + numb;
        }
        started = false;
        ended = false;
      }
    }
  }

  println!("Final sum: {}", sum);

  Ok(())
}
