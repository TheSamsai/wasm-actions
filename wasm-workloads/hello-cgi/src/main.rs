
use std::io::Write;
use dumb_cgi::{Request, Query, Body, EmptyResponse};

fn main() {
    let req = Request::new().unwrap();

    let mut response = EmptyResponse::new(200)
        .with_content_type("text/plain");

    let mut body_string = String::new();

    if let Body::Some(vec) = req.body() {
        body_string = String::from_utf8(vec.clone()).unwrap();
    }

    writeln!(&mut response, "METHOD: {:?}", req.var("METHOD"));
    writeln!(&mut response, "PATH_INFO: {:?}", req.var("PATH_INFO"));
    writeln!(&mut response, "QUERY_STRING: {:?}", req.var("QUERY_STRING"));
    writeln!(&mut response, "BODY: {:?}", body_string);

    if let Query::Some(map) = req.query() {
        map.iter().for_each(|(k, v)|  {
            writeln!(&mut response, "{}: {}", k, v);
        })
    }

    response.respond();
}
