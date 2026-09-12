// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the anarchy-codex database
db = db.getSiblingDB('anarchy-codex');

// Create collections with proper indexes
db.createCollection('users');
db.createCollection('articles');
db.createCollection('events');
db.createCollection('libraryfiles');
db.createCollection('threads');
db.createCollection('messages');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "pseudonym": 1 }, { unique: true });
db.users.createIndex({ "googleId": 1 });

db.news.createIndex({ "author": 1 });
db.news.createIndex({ "tags": 1 });
db.news.createIndex({ "isPublished": 1 });
db.news.createIndex({ "createdAt": -1 });

db.events.createIndex({ "newsArticle": 1 });
db.events.createIndex({ "organizer": 1 });
db.events.createIndex({ "startDate": 1 });
db.events.createIndex({ "isPublic": 1 });

db.libraryfiles.createIndex({ "author": 1 });
db.libraryfiles.createIndex({ "tags": 1 });
db.libraryfiles.createIndex({ "isPublic": 1 });
db.libraryfiles.createIndex({ "title": "text", "description": "text" });

db.threads.createIndex({ "author": 1 });
db.threads.createIndex({ "tags": 1 });
db.threads.createIndex({ "isPinned": 1 });
db.threads.createIndex({ "lastActivityAt": -1 });

db.messages.createIndex({ "thread": 1 });
db.messages.createIndex({ "author": 1 });
db.messages.createIndex({ "parentMessage": 1 });
db.messages.createIndex({ "createdAt": 1 });

print('MongoDB initialization completed successfully!');
print('Database: anarchy-codex');
print('Collections created: users, articles, events, libraryfiles, threads, messages');