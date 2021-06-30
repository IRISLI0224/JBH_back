const supertest = require('supertest');

const app = require('../../src/app');
const { connectToDB, disconnectDB } = require('../../src/utils/db');
const User = require('../../src/models/user');

const request = supertest(app);

describe('/users', () => {
  beforeAll(() => {
    connectToDB();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await disconnectDB();
  });

  const createUser = async (body) => request.post('/api/users').send(body);

  const validClientUser = {
    firstName: 'Jason',
    lastName: 'Zhang',
    gender: true,
    email: 'jasonzhang@gmail.com',
    birthYear: 1910,
    phone: '11111111',
  };

  const validAdminUser = {
    firstName: 'Admin',
    userType: true,
  };

  it('should return 201 if request sending clientUser is valid', async () => {
    const res = await createUser(validClientUser);
    expect(res.statusCode).toBe(201);
  });

  it('should return 201 if request sending adminUser is valid', async () => {
    const res = await createUser(validAdminUser);
    expect(res.statusCode).toBe(201);
  });

  it('should save client user to db if request is valid', async () => {
    await createUser(validClientUser);
    const user = await User.findOne({ email: validClientUser.email });
    expect(user.firstName).toBe(validClientUser.firstName);
    expect(user.lastName).toBe(validClientUser.lastName);
  });

  it.each`
    field          | value
    ${'firstName'} | ${undefined}
    ${'lastName'}  | ${undefined}
    ${'gender'}    | ${'male'}
    ${'phone'}     | ${'11111'}
    ${'email'}     | ${'@'}
    ${'email'}     | ${'a@b'}
  `('should return 400 when $field is $value', async ({ field, value }) => {
    const user = { ...validClientUser };
    user[field] = value;
    const res = await createUser(user);
    expect(res.statusCode).toBe(400);
  });
});
