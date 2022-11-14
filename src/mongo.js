import { MongoClient } from "mongodb";
import { config } from "dotenv";
config();
import { env } from "process";

export const connect = async () => {
  try {
    const { DB_URL, DB_NAME, DB_COLLECTION } = env;
    const client = new MongoClient(DB_URL);
    await client.connect();
    console.log("Connected successfully to Database");
    const db = client.db(DB_NAME);
    const wnftsCollection = db.collection(DB_COLLECTION);
    return new DB(wnftsCollection);
  } catch (err) {
    console.log(err.message);
  }
};

class DB {
  constructor(wnftsCollection) {
    this.wnftsCollection = wnftsCollection;
  }
  async updateTrx(query, data) {
    return await this.wnftsCollection.findOneAndUpdate(
      query,
      { $set: data },
      { returnDocument: "after" }
    );
  }
  async getTrx(query) {
    return await this.wnftsCollection.find(query).toArray();
  }
}
