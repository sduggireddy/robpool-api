// Must be at top
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { typeOrmConfig } from '../config';
import { Handler, Context, Callback } from 'aws-lambda';
import {Notes} from './models/Notes';
import { failure, success } from '../../libs/response-lib';

export function randomInt (low: number, high: number):number {
  return Math.floor(Math.random() * (high - low + 1) + low);
}

const create: Handler = async (event: any, context: Context, callback: Callback) => {
    try {
      const data = event.body;
      const conn = await createConnection(typeOrmConfig);

      // Create note.
      let note = new Notes();
      note.userId = event.identity.cognitoIdentityId;
      note.noteId = randomInt(1,999999).toString();
      note.content = data.content;
      note.createdAt = new Date();

      const notesRepo = conn.getRepository(Notes);
      await notesRepo.insert(note);

      // Close connection
      await conn.close();

      callback(null, success(note));
    }
    catch(ex) {
      console.log(ex);
      callback(null, failure({status:false}));
    }    
  };

  const update: Handler = async (event: any, context: Context, callback: Callback) => {
    try {
      const data = event.body;
      const conn = await createConnection(typeOrmConfig);
      //update note
      const notesRepo = conn.getRepository(Notes);
      await notesRepo.createQueryBuilder().update(Notes)
                            .set({content: data.content})
                            .where("userId = :userId AND noteId = :noteId", {userId: event.identity.cognitoIdentityId, noteId: event.path.id})
                            .execute()

      // Close connection
      await conn.close();

      callback(null, success({ status: true }));
    }
    catch(ex) {
      console.log(ex);
      callback(null, failure({status:false}));
    }    
  };

  const get: Handler = async (event: any, context: Context, callback: Callback) => {
      try {
        const conn = await createConnection(typeOrmConfig);
        const notesRepo = conn.getRepository(Notes);        
        const note = await notesRepo.createQueryBuilder("notes")
        .select("userId, noteId, content, createdAt")
        .where("userId = :userId AND noteId = :noteId", {userId: event.identity.cognitoIdentityId, noteId: event.path.id})
        .getRawOne() as Notes;  
        
        console.log(`note: ${JSON.stringify(note)}`);
        // Close connection
        await conn.close();

        if (note) {
          callback(null, success(note));
        }
        else {
          callback(null, failure({ status: false, error: 'Item not found.'}));
        }
      }
      catch(ex) {
        console.log(ex);
        callback(null, failure({status:false}));
      }
  }

  const list: Handler = async (event, context, cb) => {
    try {
      //NOTE: This is important to set. otherwise lambda errors with Task timed out after 6.01 secs
      context.callbackWaitsForEmptyEventLoop = false;
      const conn = await createConnection(typeOrmConfig);
      const note: Notes[] = await conn.getRepository(Notes)
                                .createQueryBuilder("notes")
                                .select("userId, noteId, content, createdAt")
                                .where("userId = :userId", {userId: event.identity.cognitoIdentityId})
                                .getRawMany() as Notes[];                                
      //console.log(`notes: ${JSON.stringify(note)}`);
      await conn.close();  
      if (note) {      
        cb(null, success(note));                        
      }
      else {        
        cb(null, failure({ status: false, error: 'Item not found.'}));
      }            
    }
    catch(ex) {
      console.log(ex);
      cb(null, failure({status:false}));
    }
  }

  const deleteNote: Handler = async (event: any, context: Context, callback: Callback) => {
    try {
      //NOTE: This is important to set. otherwise lambda errors with Task timed out after 6.01 secs
      context.callbackWaitsForEmptyEventLoop = false;
      const data = event.body;
      const conn = await createConnection(typeOrmConfig);
      //delete note
      const notesRepo = conn.getRepository(Notes);
      await notesRepo.createQueryBuilder().delete().from(Notes)                            
                            .where("userId = :userId AND noteId = :noteId", {userId: event.identity.cognitoIdentityId, noteId: event.path.id})
                            .execute();

      // Close connection
      await conn.close();  

      callback(null, success({status: true}));              
    }
    catch(ex) {
      console.log(ex);
      callback(null, failure({status:false}));
    }
}

  export {create, get, update, list, deleteNote}