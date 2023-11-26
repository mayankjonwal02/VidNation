const mongoose = require("mongoose");
mongoURI =
  "mongodb+srv://vidnation:vidnation@cluster0.luknjg4.mongodb.net/MDNTube?retryWrites=true&w=majority";

const mongodb = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      "--------------------connected to the MongoDB database---------------------------"
    );
  } catch (error) {
    console.log("Database error : ", error.message);
  }
};

module.exports = mongodb;
