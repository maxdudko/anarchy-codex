import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { LibraryFile, LibraryFileSchema } from './schemas/library-file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LibraryFile.name, schema: LibraryFileSchema },
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [LibraryController],
  providers: [LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}
