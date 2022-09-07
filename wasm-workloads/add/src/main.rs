use std::env;

fn main() {
    let args = env::args().skip(1);

    let sum: i32 = args.map(|v| v.parse::<i32>().expect("Failed to parse value")).sum();

    println!("{}", sum);
}
