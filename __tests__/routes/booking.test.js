const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST);
const supertest = require('supertest');
const app = require('../../src/app');
const { connectToDB, disconnectDB } = require('../../src/utils/db');
const Booking = require('../../src/models/booking');
const Session = require('../../src/models/session');
const { generateToken } = require('../../src/utils/jwt');

const request = supertest(app);

const TOKEN = generateToken({ id: 'fake_id' }); // to pass the AuthGuard middleware.

const today = new Date();

describe('/bookings', () => {
  beforeAll(() => {
    connectToDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    await Booking.deleteMany({}).exec();
    await Session.deleteMany({}).exec();
  });

  afterEach(async () => {
    await Booking.deleteMany({}).exec();
    await Session.deleteMany({}).exec();
  });

  // ======================= ADD BOOKING ===================

  describe('POST /', () => {
    let validateBooking;
    let sessionData;
    beforeEach(async () => {
      sessionData = {
        date: '2021-07-10',
        time: 0,
        maxNumber: 20,
      };
      await Session.insertMany(sessionData);

      validateBooking = {
        bookingDate: sessionData.date,
        numOfGuests: '10',
        firstName: 'POST',
        lastName: 'Kate',
        gender: true,
        email: 'Nick@js.com',
        phone: '0123456789',
        dateOfBirth: '1968-01-02',
        paidAmount: '68',
      };
    });

    const addBooking = async (body, isRealPaymentId) => {
      let newBody = body;
      // to pass the payment operation in addBooking.
      if (isRealPaymentId) {
        const { id } = await stripe.paymentMethods.create(
          {
            type: 'card',
            card: {
              number: '4242424242424242',
              exp_month: today.getMonth() + 1,
              exp_year: today.getFullYear() + 1,
            },
          },
          { apiKey: process.env.STRIPE_SECRET_TEST },
        );
        newBody = { ...body, id };
      }
      return request.post('/api/bookings').send(newBody);
    };

    it('should return 201 if request is valid', async () => {
      const res = await addBooking(validateBooking, true);
      expect(res.statusCode).toBe(201);
    });

    it('should save booking if request is valid', async () => {
      const res = await addBooking(validateBooking, true);
      const booking = await Booking.findOne({ email: 'Nick@js.com' }).exec();
      expect(booking.bookingDate.toISOString().slice(0, 10)).toBe(
        sessionData.date,
      );
      expect(booking.numOfGuests.toString()).toBe('10');
      expect(booking.firstName).toBe('POST');
      expect(booking.lastName).toBe('Kate');
      expect(booking.gender.toString()).toBe('true');
      expect(booking.phone).toBe('0123456789');
      expect(booking.dateOfBirth.toISOString().slice(0, 10)).toBe('1968-01-02');
      expect(booking.paidAmount.toString()).toBe('68');
    });

    it.each`
      field            | value
      ${'firstName'}   | ${''}
      ${'firstName'}   | ${500}
      ${'firstName'}   | ${'F'}
      ${'firstName'}   | ${'asdfghjklzxcvbnmqwert'}
      ${'lastName'}    | ${''}
      ${'lastName'}    | ${500}
      ${'lastName'}    | ${'F'}
      ${'lastName'}    | ${'asdfghjklzxcvbnmqwert'}
      ${'gender'}      | ${''}
      ${'gender'}      | ${'adbded'}
      ${'email'}       | ${''}
      ${'email'}       | ${'abdc@adv.au'}
      ${'email'}       | ${'abdc@au'}
      ${'phone'}       | ${''}
      ${'phone'}       | ${'abdcddef'}
      ${'phone'}       | ${'1234567'}
      ${'phone'}       | ${'12345678901'}
      ${'bookingDate'} | ${''}
      ${'bookingDate'} | ${'abdcdefg'}
      ${'bookingDate'} | ${'08 Aug 2021'}
      ${'numOfGuests'} | ${''}
      ${'numOfGuests'} | ${'abdcdefg'}
      ${'numOfGuests'} | ${'-1'}
      ${'numOfGuests'} | ${'1.25'}
      ${'numOfGuests'} | ${'21'}
      ${'dateOfBirth'} | ${''}
      ${'dateOfBirth'} | ${'abdcdefg'}
      ${'dateOfBirth'} | ${'08 Aug 2021'}
      ${'paidAmount'}  | ${''}
      ${'paidAmount'}  | ${'abdcdefg'}
      ${'paidAmount'}  | ${'9'}
      ${'paidAmount'}  | ${'9.25'}
    `('should return 400 when $field is $value', async ({ field, value }) => {
      validateBooking = { ...validateBooking, [field]: value };
      const res = await addBooking(validateBooking, false);
      expect(res.statusCode).toBe(400);
    });
  });

  // ======================= GET BOOKINGS =====================
  describe('GET /', () => {
    let validateBooking;
    let sessionData;
    beforeEach(async () => {
      sessionData = [
        {
          date: '2021-07-10',
          time: 0,
          maxNumber: 20,
        },
        {
          date: '2021-08-10',
          time: 0,
          maxNumber: 20,
        },
        {
          date: '2021-09-10',
          time: 0,
          maxNumber: 20,
        },
      ];
      await Session.insertMany(sessionData);
      validateBooking = [
        {
          bookingDate: sessionData[0].date,
          numOfGuests: '10',
          firstName: 'GET',
          lastName: 'Kate',
          gender: true,
          email: 'Nick1@js.com',
          phone: '0123456789',
          dateOfBirth: '1968-01-02',
          paidAmount: '68',
          bookingNum: 'DBJ731345458',
          id: '13adfaew',
        },
        {
          bookingDate: sessionData[1].date,
          numOfGuests: '10',
          firstName: 'GET2',
          lastName: 'Kate',
          gender: true,
          email: 'Nick2@js.com',
          phone: '1234567890',
          dateOfBirth: '1968-01-02',
          paidAmount: '68',
          bookingNum: 'DBJ123456789',
          id: '13adfaew',
        },
        {
          bookingDate: sessionData[2].date,
          numOfGuests: '10',
          firstName: 'GET3',
          lastName: 'Kate',
          gender: true,
          email: 'Nick3@js.com',
          phone: '2345678901',
          dateOfBirth: '1968-01-02',
          paidAmount: '68',
          bookingNum: 'DBJ987654321',
          id: '13adfaew',
        },
      ];

      await Booking.insertMany(validateBooking);
      // 上述的booking(第三项)添加到对应的session中用于测试.
      const session1 = await Session.findOneAndUpdate(
        { date: validateBooking[2].bookingDate },
        { $push: { bookings: validateBooking[2].numOfGuests } },
        { new: true },
      );
    });

    const getAllBookings = async () => request.get('/api/bookings/all').set('Authorization', `Bearer ${TOKEN}`);

    it('should return 200 if request is valid', async () => {
      const res = await getAllBookings();
      expect(res.statusCode).toBe(200);
    });

    it('should return bookings if request is valid', async () => {
      const res = await getAllBookings();
      expect(res.body.length).toEqual(3);
      expect(res.body[0]).toHaveProperty('bookingNum');
      expect(res.body[0].bookingNum).toBe('DBJ731345458');
      expect(res.body[1]).toHaveProperty('bookingNum');
      expect(res.body[1].bookingNum).toBe('DBJ123456789');
      expect(res.body[2]).toHaveProperty('bookingNum');
      expect(res.body[2].bookingNum).toBe('DBJ987654321');
    });

    // ------------------getBookingsByMonth-------------------
    const getBookingsByMonth = async (year, month) => request.get(`/api/bookings/monthly/${year}/${month}`);

    it('should return 201 if request is valid', async () => {
      const dateDetails = sessionData[2].date.split('-');
      const [year, month, day] = [
        dateDetails[0],
        dateDetails[1],
        dateDetails[2],
      ];
      const res = await getBookingsByMonth(year, month);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('date');
      expect(res.body.date).toBe(`${year}-${month}`);
      expect(res.body).toHaveProperty('bookingsExistenceArr');
      expect(res.body.bookingsExistenceArr[day - 1]).toBe(true);
    });

    // --------------------getBookingsByArgs---------------

    const getBookingsByArgs = async (field, value) => request
      .get(`/api/bookings/${field}/${value}`)
      .set('Authorization', `Bearer ${TOKEN}`);

    it.each`
      param            | field            | value
      ${'phone'}       | ${'phone'}       | ${'0123456789'}
      ${'email'}       | ${'email'}       | ${'Nick3@js.com'}
      ${'bookingdate'} | ${'bookingDate'} | ${'2021-07-10'}
      ${'bookingnum'}  | ${'bookingNum'}  | ${'DBJ987654321'}
      ${'id'}          | ${'_id'}         | ${'existed'}
    `(
      'should return 200 when $param is $value',
      async ({ param, field, value }) => {
        let requestValue = value;
        if (param === 'id') {
          requestValue = (await Booking.findOne({}).exec())._id.toString();
        }
        const res = await getBookingsByArgs(param, requestValue);
        expect(res.statusCode).toBe(200);
        const expectedValue = param === 'bookingdate'
          ? `${requestValue}T00:00:00.000Z`
          : requestValue;
        expect(res.body[0][field]).toEqual(expectedValue);
      },
    );

    it('should return 404 if the pathname is invalid', async () => {
      const res = await getBookingsByArgs('pho', '0123456789');
      expect(res.statusCode).toBe(404);
    });
  });

  // ======================= UPDATE BOOKING ===================

  describe('UPDATE /', () => {
    let validateBooking;
    beforeEach(async () => {
      const sessionData = {
        date: '2021-07-10',
        time: 0,
        maxNumber: 20,
      };
      await Session.insertMany(sessionData);

      validateBooking = {
        bookingDate: sessionData.date,
        numOfGuests: '10',
        firstName: 'Nick',
        lastName: 'Kate',
        gender: true,
        email: 'Nick1@js.com',
        phone: '0123456789',
        dateOfBirth: '1968-01-02',
        paidAmount: '68',
        bookingNum: 'DBJ731345458',
        id: '13adfaew',
      };
      await Booking.insertMany(validateBooking);
      // 上述的booking添加到对应的session中.
      const session = await Session.findOneAndUpdate(
        { date: validateBooking.bookingDate },
        { $push: { bookings: validateBooking.numOfGuests } },
        { new: true },
      );
    });

    const updateBookingsByArgs = async (field, fValue, path, pValue) => {
      const updatedBooking = { ...validateBooking, [field]: fValue };
      return request
        .put(`/api/bookings/${path}/${pValue}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(updatedBooking);
    };

    const cases = [
      ['bookingDate', '2021-07-11', '2021-07-11T00:00:00.000Z'],
      ['numOfGuests', '11', '11'],
      ['firstName', 'NickUPDATE', 'NickUPDATE'],
      ['lastName', 'KateUPATE', 'KateUPATE'],
      ['gender', false, 'false'],
      ['email', 'Nick1UPDATE@js.com', 'Nick1UPDATE@js.com'],
      ['phone', '1111111111', '1111111111'],
      ['dateOfBirth', '1968-01-03', '1968-01-03T00:00:00.000Z'],
      ['paidAmount', '70', '70'],
      ['bookingNum', 'DBJ731345459', 'DBJ731345459'],
    ];

    // --------------------updateBookingByBookingNum---------------

    it.each(cases)(
      'should return 201 when %s is %s',
      async (field, fValue, eValue) => {
        const res = await updateBookingsByArgs(
          field,
          fValue,
          'bookingnum',
          validateBooking.bookingNum,
        );
        expect(res.statusCode).toBe(201);
        expect(res.body[field].toString()).toBe(eValue);
      },
    );

    // --------------------updateBookingById---------------

    it.each(cases)(
      'should return 201 when %s is %s',
      async (field, fValue, eValue) => {
        const bookingId = (await Booking.findOne({}).exec())._id;
        const res = await updateBookingsByArgs(field, fValue, 'id', bookingId);
        expect(res.statusCode).toBe(201);
        expect(res.body[field].toString()).toBe(eValue);
      },
    );

    it('should return 404 if the first pathname is invalid', async () => {
      const res = await updateBookingsByArgs(
        'bookingDate',
        '2021-07-11',
        'boo',
        validateBooking.bookingNum,
      );
      expect(res.statusCode).toBe(404);
    });

    it('should return 200 if the second pathname is invalid', async () => {
      const res = await updateBookingsByArgs(
        'bookingDate',
        '2021-07-11',
        'bookingnum',
        'adfdas12354',
      );
      expect(res.statusCode).toBe(200);
    });
  });

  // ======================= DELETE BOOKING ===================

  describe('DELETE /', () => {
    let validateBooking;
    beforeEach(async () => {
      const sessionData = {
        date: '2021-07-10',
        time: 0,
        maxNumber: 20,
      };
      await Session.insertMany(sessionData);

      validateBooking = {
        bookingDate: sessionData.date,
        numOfGuests: '10',
        firstName: 'Nick',
        lastName: 'Kate',
        gender: true,
        email: 'Nick1@js.com',
        phone: '0123456789',
        dateOfBirth: '1968-01-02',
        paidAmount: '68',
        bookingNum: 'DBJ731345458',
        id: '13adfaew',
      };
      await Booking.insertMany(validateBooking);
      // 上述的booking添加到对应的session中.
      const session = await Session.findOneAndUpdate(
        { date: validateBooking.bookingDate },
        { $push: { bookings: validateBooking.numOfGuests } },
        { new: true },
      );
    });

    //  -----------------deleteBookingById --------------------

    const deleteBooking = async (param) => request
      .delete(`/api/bookings/id/${param}`)
      .set('Authorization', `Bearer ${TOKEN}`);

    it('should return 200 if delete is successful', async () => {
      const bookingId = (await Booking.findOne({}).exec())._id;
      const res = await deleteBooking(bookingId);
      expect(res.statusCode).toBe(200);
    });

    it('should return 500 if the bookingId is invalid', async () => {
      const res = await deleteBooking('testId001');
      expect(res.statusCode).toBe(500);
    });
  });
});
