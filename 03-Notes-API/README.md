# Project 03 - Notes API

## Description

A REST API for managing notes using Node.js and Express.

This project stores notes in memory and demonstrates CRUD operations without using a database.

## Tech Stack

Node.js
Express.js
JavaScript


## Architecture

server.js
    ↓
routes
    ↓
middleware
    ↓
controllers
    ↓
data


## API Endpoints

Method	Endpoint	Purpose
GET	/notes	Get all notes
GET	/notes/:id	Get note by ID
GET	/notes/category/:category	Filter by category
POST	/notes	Create note
PUT	/notes/:id	Update note
DELETE	/notes/:id	Delete note