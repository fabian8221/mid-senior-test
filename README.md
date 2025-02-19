# Personal Loan API

## Context

This project is a backend API that allows users to register and apply for personal loans. It includes features for loan management, payments management, loan balance tracking, and loan history.

## Tech Stack

- **Node.js**: Backend development
- **Express.js**: Web framework for building APIs
- **PostgreSQL**: Database management
- **Docker**: Containerization for easy deployment
- **Jest**: Testing framework

## Features

- User registration and authentication using JWT
- Loan application and management
- Payment processing and history tracking
- Admin functionality for loan status updates
- **Advanced Security Features**:
  - Password hashing with bcrypt
  - Rate limiting to prevent abuse
- **Pagination** for listing loans and payments
- Logging mechanisms for user actions

## Requirements

- Node.js (v14 or higher)
- Docker and Docker Compose
- PostgreSQL

## Setup Instructions

### 1. Clone the Repository

```
git clone https://github.com/fabian8221/mid-senior-test.git
cd mid-senior-test
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following configuration:

```env
# Development Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loan_db
DB_USER=postgres
DB_PASSWORD=yourpassword

# Test Database
TEST_DB_HOST=localhost
TEST_DB_PORT=5433
TEST_DB_NAME=loan_db_test
TEST_DB_USER=postgres
TEST_DB_PASSWORD=yourpassword

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

### 4. Run Database Migrations

To create the necessary database tables, run the following command:

```bash
npm run migrate
```

### 5. Start the Application

You can start the application using Docker:

```bash
docker-compose up
```

Alternatively, you can run it locally:

```bash
npm start
```

### 6. Run Tests

To run the tests, use the following command:

```bash
npm test
```

### 7. API Endpoints

#### User Authentication

- **Register a new user**
  - **POST** `/api/users/register`
  - Request Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`

- **Login a user**
  - **POST** `/api/users/login`
  - Request Body: `{ "email": "john@example.com", "password": "password123" }`

#### Loan Management

- **Submit a new loan application**
  - **POST** `/api/loans`
  - Request Body: `{ "amount": 5000, "purpose": "Home Renovation", "duration": 12 }`

- **Retrieve all loans for the logged-in user**
  - **GET** `/api/loans`

- **Retrieve details of a specific loan**
  - **GET** `/api/loans/:id`

- **Update the status of a loan**
  - **PATCH** `/api/loans/:id/status`
  - Request Body: `{ "status": "Approved" }`

#### Payments

- **Make a payment for a loan**
  - **POST** `/api/payments`
  - Request Body: `{ "loan_id": 1, "amount_paid": 1000 }`

- **Retrieve payment history of a specific loan**
  - **GET** `/api/loans/:id/payments`

## Testing

The project includes unit tests for key features. You can run the tests using:

```bash
npm test
```

## Acknowledgments

- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [Jest](https://jestjs.io/)