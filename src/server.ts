import {Server} from 'http';
import app from './app';

const main = async () => {
  const server: Server = app.listen(3000, () =>
    console.log(`
🚀 Server ready at: http://localhost:3000`)
  );
};

main();
