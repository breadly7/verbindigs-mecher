.PHONY: frontend
frontend:
	cd frontend && npm start

.PHONY: backend
backend:
	cd backend && go run cmd/main.go