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

    // --- Add this block to insert a test document if the collection is empty ---
    const count1 = await bloggersCollection.countDocuments({});
    const count2 = await postsCollection.countDocuments({});
    if (count1 === 0) {
        console.log(`Collection '${BlOGGER_COLLECTION_NAME}' is empty. Inserting a test document...`);
        const testBlogger: Blogger = {
            id: 'test-blogger-1',
            name: 'Example Blogger',
            description: 'A test blogger created to ensure collection visibility.',
            websiteUrl: 'https://example.com/blogger'
        };
        await bloggersCollection.insertOne(testBlogger);
        console.log('Test document inserted.');
    } else {
        console.log(`Collection '${BlOGGER_COLLECTION_NAME}' already has ${count1} documents.`);
    }
    if (count2 === 0) {
        console.log(`Collection '${POSTS_COLLECTION_NAME}' is empty. Inserting a test document...`);
        const testPost: Post = {
            id: 'test-post-1',
            title: 'New post',
            shortDescription: 'A test post created to ensure collection visibility.',
            content: 'bla bla bla',
            blogId: 'test blogger id',
            blogName: 'test blog name'
        };

        await postsCollection.insertOne(testPost);
        console.log('Test document inserted.');
    } else {
        console.log(`Collection '${BlOGGER_COLLECTION_NAME}' already has ${count2} documents.`);
    }
    // --- End of new block ---

  } catch (e) {
    await client.close();
    throw new Error(`❌ Local Database not connected: ${e}`);
  }
}