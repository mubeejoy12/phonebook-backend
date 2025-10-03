require("dotenv").config();
const mongoose = require("mongoose");

if (!process.env.MONGODB_URI) {
  console.log("❌ No MongoDB URI found in .env");
  process.exit(1);
}

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ connected to MongoDB");
  })
  .catch((error) => {
    console.log("❌ error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

// Example: fetch all persons
Person.find({}).then((result) => {
  console.log("📖 Persons in DB:");
  result.forEach((person) => {
    console.log(person);
  });
  mongoose.connection.close();
});
