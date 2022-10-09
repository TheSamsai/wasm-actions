
use std::io::Write;

use dumb_cgi::*;

use serde::{Deserialize, Serialize};

use serde_json::json;

#[derive(Serialize, Deserialize)]
struct Input {
    numbers: Vec<i32>,
}

fn main() {
    let req = Request::new().unwrap();

    let mut response = EmptyResponse::new(200)
        .with_content_type("application/json");

    if let Body::Some(bytes) = req.body() {
        let body_string = String::from_utf8(bytes.clone()).unwrap();

        let input_numbers: Input = serde_json::from_str(&body_string).unwrap();

        let sum: i32 = input_numbers.numbers.iter().sum();

        write!(&mut response, "{}", json!({
            "result": sum
        }));
    } else {
        response.set_status(400);

        write!(&mut response, "{}", json!({
            "error": "request body missing or malformed"
        }));
    }

    response.respond();
}
