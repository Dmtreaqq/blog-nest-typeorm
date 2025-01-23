import { fromUTF8ToBase64 } from '../../src/common/guards/basic-auth.guard';

export const createUserInput: any = {
  login: 'newlogin',
  email: 'email@email.com',
  password: '123456',
};

export const basicAuthHeader = `Basic ${fromUTF8ToBase64(process.env.BASIC_LOGIN)}`;
