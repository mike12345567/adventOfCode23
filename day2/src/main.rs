use lazy_static::lazy_static;
use regex::Regex;
use std::fs::File;
use std::io::{self, Read};

lazy_static! {
  static ref BLUE: Regex = Regex::new(r"(\d+) blue").unwrap();
  static ref RED: Regex = Regex::new(r"(\d+) red").unwrap();
  static ref GREEN: Regex = Regex::new(r"(\d+) green").unwrap();
  static ref GAME: Regex = Regex::new(r"Game (\d+)").unwrap();
}

struct Cubes {
  blue: u32,
  red: u32,
  green: u32,
}

fn check_pattern(input: &str, re: &Regex) -> Option<u32> {
  if let Some(captures) = re.captures(input) {
    if let Some(number_capture) = captures.get(1) {
      let number = number_capture.as_str().parse::<u32>().unwrap();
      return Some(number);
    }
  }
  return None;
}

fn read_file() -> io::Result<Vec<String>> {
  let file_path = "./input.txt";
  let mut file = File::open(file_path)?;
  let mut contents = String::new();
  file.read_to_string(&mut contents)?;
  let lines: Vec<String> = contents.lines().map(String::from).collect();
  Ok(lines)
}

pub fn main() -> io::Result<()> {
  let blue_max = 14;
  let red_max = 12;
  let green_max = 13;
  let lines = read_file()?;
  let mut sum: u32 = 0;
  let mut sum_powers: u32 = 0;
  let mut valid_games: u32 = 0;
  for line in lines {
    let parts: Vec<&str> = line.split(';').collect();
    let mut valid = true;
    let mut min = Cubes {
      blue: 0,
      red: 0,
      green: 0,
    };
    for part in parts {
      let mut cubes = Cubes {
        blue: 0,
        red: 0,
        green: 0,
      };
      if let Some(blue) = check_pattern(part, &BLUE) {
        cubes.blue = cubes.blue + blue;
        if min.blue < blue {
          min.blue = blue;
        }
      }
      if let Some(red) = check_pattern(part, &RED) {
        cubes.red = cubes.red + red;
        if min.red < red {
          min.red = red;
        }
      }
      if let Some(green) = check_pattern(part, &GREEN) {
        cubes.green = cubes.green + green;
        if min.green < green {
          min.green = green;
        }
      }
      if cubes.blue > blue_max || cubes.red > red_max || cubes.green > green_max {
        valid = false;
      }
    }
    let power = min.blue * min.red * min.green;
    sum_powers = sum_powers + power;
    if valid {
      sum = sum + check_pattern(&line, &GAME).unwrap();
      valid_games = valid_games + 1;
    }
  }
  println!(
    "Game sum: {} - powers: {} - valid: {}",
    sum, sum_powers, valid_games
  );
  Ok(())
}
