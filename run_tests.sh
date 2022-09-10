#! /bin/sh

export CI=true

cd frontend
yarn test

cd ../backend
yarn test
