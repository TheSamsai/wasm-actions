
export CI=1

test: test-backend test-frontend

test-backend:
	cd backend && yarn test

test-frontend:
	cd frontend && yarn test
