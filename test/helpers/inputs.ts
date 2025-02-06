import { fromUTF8ToBase64 } from '../../src/common/guards/basic-auth.guard';
import { CreateBlogInputDto } from '../../src/features/blog-platform/api/input-dto/create-blog-input.dto';

export const createUserInput: any = {
  login: 'newlogin',
  email: 'email@email.com',
  password: '123456',
};

export const createBlogInput: CreateBlogInputDto = {
  name: 'SomeBlog',
  description: 'Some description',
  websiteUrl: 'https://somewebsite.com',
};

export const basicAuthHeader = `Basic ${fromUTF8ToBase64(process.env.BASIC_LOGIN)}`;
