import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('testing')
export class TestingController {
  // constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    // await this.dataSource.query(`
    //   DELETE FROM reactions;
    //
    //   DELETE FROM comments;
    //
    //   DELETE FROM posts;
    //   DELETE FROM blogs;
    //
    //   DELETE FROM users_device_sessions;
    //   DELETE FROM users;
    // `);
  }
}
