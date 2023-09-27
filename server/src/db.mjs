import sqlite from 'better-sqlite3';

// db é uma isntancia do banco de dados
export const db = sqlite('./database.sqlite3');
/* 
const posts = db.prepare('select * from posts').all();
console.log(posts) */
