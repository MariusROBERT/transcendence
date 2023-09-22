import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';

export class userPictureFileInterception extends FileInterceptor('file', {
  storage: diskStorage({
    destination: './public/',
    filename: (req, file, cb) => {
      const filename: string = file.originalname;
      const extension: string = filename.split('.')[1];
      cb(null, `${randomUUID()}.${extension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(
        new HttpException(
          'Only image files are allowed!',
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
    cb(null, true);
  },
}) {}
