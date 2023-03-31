import tripRoutes from './trips.js';
import userRoutes from './users.js';

const constructorMethod = (app) => {
  app.use('/trips', tripRoutes);
  app.use('/users', userRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};

export default constructorMethod;
