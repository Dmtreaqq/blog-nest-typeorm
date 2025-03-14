import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Controller('testing')
export class TestingController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    await this.dataSource.query(`
        
      DELETE FROM comment;
      DELETE FROM post;
      DELETE FROM blog;

      DELETE FROM user_device_session; 
      DELETE FROM user_meta_info;

      DELETE FROM "user";
    `);
  }
}
