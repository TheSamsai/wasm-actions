
use std::io::BufWriter;
use std::io::prelude::*;
use std::fs::OpenOptions;

use dumb_cgi::{Request, Query, Body, EmptyResponse};

fn main() {
    let mut file = OpenOptions::new().append(true).create(true).open("log.txt").unwrap();

    let mut writer = BufWriter::new(file);

    writeln!(writer, "New visit");

    let req = Request::new().unwrap();

    let mut response = EmptyResponse::new(200)
        .with_content_type("text/plain");

    let mut file = OpenOptions::new().read(true).open("log.txt").unwrap();
    let mut log_string = String::new();
    file.read_to_string(&mut log_string);

    writeln!(&mut response, "{}", log_string);

    response.respond();
}
