const supertest = require('supertest');
const app = require('../../src/app');
const Session = require('../../src/models/session');
const { connectToDB } = require('../../src/utils/db');

const request = supertest(app);

describe('/sessions', () => {
  beforeAll(() => {
    connectToDB();
  });

  beforeEach(async () => {
    await Session.deleteMany({});
  });

  const validSession = { date: '2021-06-28', time: 0, maxNumber: 50 };

  const formatValidator = [
    { field: 'date', value: undefined },
    { field: 'time', value: undefined },
    { field: 'maxNumber', value: undefined },
    { field: 'date', value: '2-06-01' },
    { field: 'date', value: '2021-006-01' },
    { field: 'date', value: '2021-06-001' },
    { field: 'date', value: '20211-06-01' },
    { field: 'date', value: '2021.06.01' },
    { field: 'time', value: 'abc' },
    { field: 'maxNumber', value: 'abc' },
  ];

  //= =================== POST TEST ====================
  describe('POST', () => {
    const createSession = (body) => request.post('/api/sessions').send(body);

    it('should return 201 if request is valid', async () => {
      const res = await createSession(validSession);
      expect(res.statusCode).toBe(201);
    });

    it('should save session to database if request is valid', async () => {
      await createSession(validSession);
      const session = await Session.findOne({
        date: validSession.date,
        time: validSession.time,
      });
      expect(!!session).toBe(true);
    });

    it.each(formatValidator)(
      'should return 400 when $field is $value',
      async ({ field, value }) => {
        const session = { ...validSession };
        session[field] = value;
        const res = await createSession(session);
        expect(res.statusCode).toBe(400);
      },
    );

    it('should return 409 if the new session is already existed', async () => {
      await createSession(validSession);
      const res = await createSession(validSession);
      expect(res.statusCode).toBe(409);
    });
  });

  //= =================== GET TEST ====================
  describe('GET', () => {
    const requestingSession = { date: '2021-06-28', time: 0 };

    const createSession = (body) => request.post('/api/sessions').send(body);

    const getSession = (params) => request.get(`/api/sessions/single/${params.date}/${params.time}`);

    it('should return 200 if request finds the target', async () => {
      await createSession(validSession);
      const res = await getSession(requestingSession);
      expect(res.statusCode).toBe(200);
    });

    it.each(formatValidator)(
      'should return 400 if request is invalid',
      async ({ field, value }) => {
        await createSession(validSession);
        const session = { ...requestingSession };
        if (!session[field]) {
          return;
        }
        session[field] = value;
        const res = await getSession(session);
        expect(res.statusCode).toBe(400);
      },
    );

    it('should return 404 if request is not found', async () => {
      await createSession(validSession);
      const session = { ...requestingSession };
      session.date = '2021-06-27';
      const res = await getSession(session);
      expect(res.statusCode).toBe(404);
    });
  });

  //= =================== PUT TEST ====================
  describe('PUT', () => {
    const newDateAndTime = { date: '2021-06-28', time: 0 };
    const newMaxNumber = { maxNumber: 40 };

    const createSession = (body) => request.post('/api/sessions').send(body);

    const updateSession = (params, body) => request.put(`/api/sessions/${params.date}/${params.time}`).send(body);

    it('should return 200 if session updates successfully', async () => {
      await createSession(validSession);
      const res = await updateSession(newDateAndTime, newMaxNumber);
      expect(res.statusCode).toBe(200);
    });

    it.each(formatValidator)(
      'should return 400 if request is invalid',
      async ({ field, value }) => {
        await createSession(validSession);
        const dateAndTime = { ...newDateAndTime };
        const maxNumber = { ...newMaxNumber };
        if (field === 'maxNumber') {
          maxNumber[field] = value;
        } else {
          dateAndTime[field] = value;
        }
        const res = await updateSession(dateAndTime, maxNumber);
        expect(res.statusCode).toBe(400);
      },
    );

    it('should return 404 if request is not found', async () => {
      await createSession(validSession);
      const dateAndTime = { ...newDateAndTime };
      dateAndTime.date = '2021-06-27';
      const res = await updateSession(dateAndTime, newMaxNumber);
      expect(res.statusCode).toBe(404);
    });
  });

  //= =================== DELETE TEST ====================
  describe('DELETE', () => {
    const sessionToBeDelete = { date: '2021-06-28', time: 0 };

    const createSession = (body) => request.post('/api/sessions').send(body);

    const deleteSession = (params) => request.delete(`/api/sessions/${params.date}/${params.time}`);

    it('should return 204 if request is valie', async () => {
      await createSession(validSession);
      const res = await deleteSession(sessionToBeDelete);
      expect(res.statusCode).toBe(204);
    });

    it('should return 404 if request is not found', async () => {
      await createSession(validSession);
      const session = { ...sessionToBeDelete };
      session.date = '2021-06-27';
      const res = await deleteSession(session);
      expect(res.statusCode).toBe(404);
    });

    it.each(formatValidator)(
      'should return 400 if request is invalid',
      async ({ field, value }) => {
        await createSession(validSession);
        const session = { ...sessionToBeDelete };
        if (!session[field]) {
          return;
        }
        session[field] = value;
        const res = await deleteSession(session);
        expect(res.statusCode).toBe(400);
      },
    );
  });
});
