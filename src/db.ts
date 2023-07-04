import mongoose from 'mongoose';
mongoose.set("strictQuery", false);
const mongoURL = process.env.MONGO_URL as string;
mongoose.connect(mongoURL);

const database = mongoose.connection;
database.on("error", (error: any) => console.log(error));
database.once("connected", () => {
  console.log("Database Connected");
});
