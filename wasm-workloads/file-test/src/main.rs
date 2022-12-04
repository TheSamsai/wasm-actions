
use std::fs;
use std::io;
use std::path::Path;

use dumb_cgi::{Request, EmptyResponse, Query, Body};

fn main() {
    let request = Request::new().unwrap();

    let dir = ls_tree(Path::new(".")).unwrap();

    let output = format!("{}", dir);

    let response = EmptyResponse::new(200)
        .with_content_type("text/plain")
        .with_body(output);

    response.respond().unwrap();
}

struct Directory {
    pub name: String,
    pub sub_dirs: Vec<Directory>,
    pub files: Vec<String>
}

impl std::fmt::Display for Directory {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        writeln!(f, "{}", self.name)?;
        for file in self.files.iter() {
            writeln!(f, "{}", file)?;
        }
        for dir in self.sub_dirs.iter() {
            writeln!(f, "{}", dir)?;
        }

        Ok(())
    }
}

fn ls_tree(dir_path: &Path) -> Result<Directory, io::Error> {
    let mut dir = Directory { name: String::from(dir_path.to_str().unwrap()), sub_dirs: vec![], files: vec![] };

    if dir_path.is_dir() {
        for entry in fs::read_dir(dir_path)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_dir() {
                match ls_tree(&path) {
                    Ok(sub_dir) => dir.sub_dirs.push(sub_dir),
                    Err(_) => ()
                }
            } else {
                dir.files.push(String::from(path.to_str().unwrap()));
            }
        }
    }

    return Ok(dir);
} 
