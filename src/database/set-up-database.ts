import mongoose from 'mongoose';

export const setUpDatabase = (onOpen: Function) => {
  const { DATABASE_NAME, DATABASE_COLLECTION_NAME, DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;

  mongoose.connect(
    `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_NAME}-xcjei.mongodb.net/${DATABASE_COLLECTION_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
  );

  mongoose.set('useCreateIndex', true);

  const database = mongoose.connection;
  database.on('error', (error) => console.log(`Error on connecting to the database: ${error.message}`));
  database.once('open', () => {
    console.log('Database is successfully connected!');
    onOpen();
  });
};
