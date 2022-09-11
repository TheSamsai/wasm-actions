
use std::io::Write;
use dumb_cgi::{Request, Query, Body, EmptyResponse};

fn main() {
    let req = Request::new().unwrap();

    let mut response = EmptyResponse::new(200)
        .with_content_type("text/plain");

    write!(&mut response, "Hello, world!");

    response.respond();
}
