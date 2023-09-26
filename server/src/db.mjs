import sqlite from "better-sqlite3";

// db é uma isntancia do banco de dados
export const db = sqlite("./database.sqlite3");
/* 
const notepads = db.prepare("select * from notepads").all();
console.log(notepads) */
