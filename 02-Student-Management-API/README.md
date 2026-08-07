# Project 02 - Student Management API

## Description

A RESTful Student Management API built using Node.js and Express.js.

This project stores student data in memory and demonstrates CRUD operations without using a database.

## Features

- Get all students
- Get student by ID
- Add a student
- Update a student
- Delete a student
- Request validation
- Proper HTTP status codes

## Tech Stack

- Node.js
- Express.js

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /students | Get all students |
| GET | /students/:id | Get one student |
| POST | /students | Create student |
| PUT | /students/:id | Update student |
| DELETE | /students/:id | Delete student |

## Run Locally

```bash
npm install
npm start
```