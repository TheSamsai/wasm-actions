#! /bin/sh

# Set up rust-analyzer to provide LSP for Rust
sudo dnf copr enable robot/rust-analyzer

# System tools required
sudo dnf install nodejs yarnpkg rust-analyzer

# JS dependencies (for LSP)
sudo npm install -g typescript-language-server typescript
