#! /bin/sh

# Set up rust-analyzer to provide LSP for Rust
sudo dnf copr enable robot/rust-analyzer

# System tools required
sudo dnf install nodejs yarnpkg rust-analyzer cargo rust-std-static-wasm32-wasi

# JS dependencies (for LSP)
sudo npm install -g typescript-language-server typescript

cd /tmp/ && \
    wget https://github.com/WasmEdge/WasmEdge/releases/download/0.11.1/WasmEdge-0.11.1-manylinux2014_x86_64.rpm && \
    sudo dnf install WasmEdge-0.11.1-manylinux2014_x86_64.rpm && \
    rm WasmEdge-0.11.1-manylinux2014_x86_64.rpm
