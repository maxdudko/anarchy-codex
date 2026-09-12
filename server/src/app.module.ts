import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

// Configuration imports
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import oauthConfig from './config/oauth.config';

// Feature modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { EventsModule } from './events/events.module';
import { ProjectsModule } from './projects/projects.module';
import { LibraryModule } from './library/library.module';
import { ForumModule } from './forum/forum.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, oauthConfig],
      envFilePath: '.env',
    }),

    // Database
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        useNewUrlParser: configService.get<boolean>('database.useNewUrlParser'),
        useUnifiedTopology: configService.get<boolean>(
          'database.useUnifiedTopology',
        ),
      }),
      inject: [ConfigService],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Feature modules
    AuthModule,
    UsersModule,
    ArticlesModule,
    EventsModule,
    ProjectsModule,
    LibraryModule,
    ForumModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
