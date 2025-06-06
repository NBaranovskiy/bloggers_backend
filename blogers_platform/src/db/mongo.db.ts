import { Collection, Db, MongoClient } from 'mongodb';
import { Blogger } from '../blogs/types/blogger';
import { SETTINGS } from '../core/settings/settings';
import {Post} from "../posts/types/post";
 
const BlOGGER_COLLECTION_NAME = 'bloggers';
const POSTS_COLLECTION_NAME = 'posts';
 
export let client: MongoClient;
export let bloggersCollection: Collection<Blogger>;
export let postsCollection: Collection<Post>;
 
// Подключения к бд
export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  //Инициализация коллекций
  bloggersCollection = db.collection<Blogger>(BlOGGER_COLLECTION_NAME);
  postsCollection = db.collection<Post>(POSTS_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('✅ Connected to the local database');
  } catch (e) {
    await client.close();
    throw new Error(`❌ Local Database not connected: ${e}`);
  }
}