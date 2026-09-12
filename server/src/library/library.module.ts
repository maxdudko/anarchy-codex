import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { LibraryFile, LibraryFileSchema } from './schemas/library-file.schema';

const uploadDest = process.env.UPLOAD_DEST || './uploads';

if (!existsSync(uploadDest)) {
  mkdirSync(uploadDest, { recursive: true });
}

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LibraryFile.name, schema: LibraryFileSchema },
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: uploadDest,
        filename: (_req, file, cb) => {
          const extension = extname(file.originalname).slice(0, 12);
          cb(
            null,
            `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`,
          );
        },
      }),
      limits: {
        fileSize: Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024,
      },
    }),
  ],
  controllers: [LibraryController],
  providers: [LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}
