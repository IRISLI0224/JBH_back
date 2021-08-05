const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST);
const supertest = require('supertest');
const app = require('../../src/app');
const { connectToDB, disconnectDB } = require('../../src/utils/db');
const Booking = require('../../src/models/booking');
const Session = require('../../src/models/session');
const { generateToken } = require('../../src/utils/jwt');

const request = supertest(app);

const TOKEN = generateToken({ id: 'fake_id' });

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

  // afterEach(async () => {
  //   await Booking.deleteMany({}).exec();
  // });

  // ======================= ADD BOOKING ===================
  describe('POST /', () => {
    let validateBooking;
    beforeAll(async () => {
      const sessionData = {
        date: '2021-07-10',
        time: 0,
        maxNumber: 20,
      };
      await Session.insertMany(sessionData);

      const { id } = await stripe.paymentMethods.create(
        {
          type: 'card',
          card: {
            number: '4242424242424242',
            exp_month: today.getMonth() + 1,
            exp_year: today.getFullYear() + 1,
          },
        },
        { apiKey: process.env.STRIPE_SECRET_TEST }
      );

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
        id,
      };
    });

    const addBooking = async (body) => request.post('/api/bookings').send(body);

    it('should return 201 if request is valid', async () => {
      const res = await addBooking(validateBooking);
      expect(res.statusCode).toBe(201);
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
      // 上述的booking添加到对应的session中.（addbooking中的步骤的mongoose版）
      const session = await Session.findOneAndUpdate(
        { date: validateBooking[2].bookingDate },
        { $push: { bookings: validateBooking[2].numOfGuests } },
        { new: true }
      );
    });

    const getAllBookings = async () =>
      request.get('/api/bookings/all').set('Authorization', `Bearer ${TOKEN}`);

    it('should return 200 if request is valid', async () => {
      const res = await getAllBookings();
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toEqual(3);
      expect(res.body[0]).toHaveProperty('sessions');
      // 完善expect的判断信息
    });

    // ------------------getBookingsByMonth-------------------
    const getBookingsByMonth = async (year, month) =>
      request.get(`/api/bookings/monthly/${year}/${month}`);

    it('should return 201 if request is valid', async () => {
      const dateDetails = sessionData[2].date.split('-');
      const year = dateDetails[0];
      const month = dateDetails[1];
      const day = dateDetails[2];
      // console.log(day);
      const res = await getBookingsByMonth(year, month);
      // console.log(res.body);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('date');
      expect(res.body.date).toBe(`${year}-${month}`);
      expect(res.body).toHaveProperty('bookingsExistenceArr');
      expect(res.body.bookingsExistenceArr[day - 1]).toBe(true);
    });

    // --------------------getBookingsByArgs---------------

    const getBookingsByArgs = async (field, value) =>
      request
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
          // console.log(requestValue);
        }
        const res = await getBookingsByArgs(param, requestValue);
        expect(res.statusCode).toBe(200);
        // console.log(res.body);
        const expectedValue =
          param === 'bookingdate'
            ? `${requestValue}T00:00:00.000Z`
            : requestValue;
        expect(res.body[0][field]).toEqual(expectedValue);
      }
    );
  });

  // ======================= UPDATE BOOKING ===================
  describe('UPDATE /', () => {
    let validateBooking;
    beforeEach(async () => {
      validateBooking = {
        bookingDate: '2021-07-10',
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
      // console.log(await Booking.find({}));
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
        // console.log({ field, fValue });
        const res = await updateBookingsByArgs(
          field,
          fValue,
          'bookingnum',
          validateBooking.bookingNum
        );
        // console.log(res.body);
        expect(res.statusCode).toBe(201);
        expect(res.body[field].toString()).toBe(eValue);
      }
    );
    // --------------------updateBookingById---------------
    it.each(cases)(
      'should return 201 when %s is %s',
      async (field, fValue, eValue) => {
        const bookingId = (await Booking.findOne({}).exec())._id;
        const res = await updateBookingsByArgs(field, fValue, 'id', bookingId);
        expect(res.statusCode).toBe(201);
        expect(res.body[field].toString()).toBe(eValue);
      }
    );
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
      // 上述的booking添加到对应的session中.（addbooking中的步骤的mongoose版）
      const session = await Session.findOneAndUpdate(
        { date: validateBooking.bookingDate },
        { $push: { bookings: validateBooking.numOfGuests } },
        { new: true }
      );
    });
    //  -----------------deleteBookingById --------------------

    it('should return 200 if delete is successful', async () => {
      const bookingId = (await Booking.findOne({}).exec())._id;
      const res = await request
        .delete(`/api/bookings/id/${bookingId}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(res.statusCode).toBe(200);
    });
  });
});
