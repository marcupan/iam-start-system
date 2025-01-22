import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          Logger.log('MongoDB connected successfully!', 'MongoDbModule');
        });
        connection.on('error', (error) => {
          Logger.error('MongoDB connection error:', error, 'MongoDbModule');
        });
        connection.on('disconnected', () => {
          Logger.warn('MongoDB disconnected.', 'MongoDbModule');
        });
        return connection;
      },
    }),
  ],
})
export class MongoDbModule implements OnModuleInit {
  private readonly logger = new Logger(MongoDbModule.name);

  async onModuleInit() {
    try {
      this.logger.log('Initializing MongoDB Module...');
    } catch (error) {
      this.logger.error('Error during MongoDB Module initialization', error);
    }
  }
}
