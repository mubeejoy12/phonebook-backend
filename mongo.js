require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log("✅ connected to MongoDB");

    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    });

    const Person = mongoose.model("Person", personSchema);

    const args = process.argv.slice(2);

    if (args.length === 0) {
      // 👉 list all persons
      Person.find({})
        .then((result) => {
          console.log("📖 Phonebook:");
          result.forEach((person) => {
            console.log(`${person.name} ${person.number}`);
          });
        })
        .finally(() => mongoose.connection.close());
    } else if (args.length === 2) {
      // 👉 add a new person
      const person = new Person({
        name: args[0],
        number: args[1],
      });

      person
        .save()
        .then(() => {
          console.log(`➕ added ${args[0]} number ${args[1]} to phonebook`);
        })
        .finally(() => mongoose.connection.close());
    } else {
      console.log("⚠️ Usage:");
      console.log("  node mongo.js              -> list all persons");
      console.log('  node mongo.js "Name" "123" -> add a new person');
      mongoose.connection.close();
    }
  })
  .catch((error) => {
    console.log("❌ error connecting to MongoDB:", error.message);
  });
