import { Controller, Get, Response, StreamableFile, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { createReadStream } from 'fs';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('check-auth')
  @UseGuards(AuthGuard('jwt'))
  checkAuth(): string {
    return this.appService.getHello();
  }

  // @Get('/file')
  // getFile(): StreamableFile {
  //   const file = createReadStream(join(process.cwd(), 'package.json'));
  //   return new StreamableFile(file);
  // }
  @Get('/print-file')
  getFileT(@Response({ passthrough: true }) res): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'tt.pdf'));
    res.set({
      // 'Content-Type': 'application/json',
      // 'Content-Type': 'image/jpeg',
      'Content-Type': 'application/pdf',
      // 'Content-Disposition': 'attachment; filename="package.json"',
    });
    return new StreamableFile(file);
  }
}
