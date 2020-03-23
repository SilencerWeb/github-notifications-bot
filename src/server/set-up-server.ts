import express from 'express';

export const setUpServer = () => {
  const app = express();
  const port = Number(process.env.PORT) || 8080;

  app.get('/', (request, response) => {
    response.sendStatus(200);
  });

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is successfully started on port ${port}`);
  });
};