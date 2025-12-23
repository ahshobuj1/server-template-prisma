import express, {Application} from 'express';
import cors from 'cors';
import {userRoutes} from './app/modules/User/user.routes';

const app: Application = express();

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Root route
app.use('/api/v1/users', userRoutes);

app.get(`/`, async (req: express.Request, res: express.Response) => {
  res.json({
    message: 'server is running',
  });
});

export default app;
