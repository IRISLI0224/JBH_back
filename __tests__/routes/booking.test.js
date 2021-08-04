const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST);
const supertest = require('supertest');
const app = require('../../src/app');
const { connectToDB, disconnectDB } = require('../../src/utils/db');
const Booking = require('../../src/models/booking');
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
    await Booking.deleteMany({});
  });

  // afterEach(async () => {
  //   await Booking.deleteMany({});
  // });

  // ======================= ADD BOOKING ===================
  describe('POST /', () => {
    let validateBooking;
    beforeAll(async () => {
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

      validateBooking = {
        bookingDate: '2021-07-10',
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
    beforeEach(async () => {
      validateBooking = [
        {
          bookingDate: '2021-07-10',
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
          bookingDate: '2021-08-10',
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
          bookingDate: '2021-09-10',
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
      // console.log(await Booking.find({}));
    });

    const getAllBookings = async () => request.get('/api/bookings/all').set('Authorization', `Bearer ${TOKEN}`);

    it('should return 200 if request is valid', async () => {
      const res = await getAllBookings();
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toEqual(3);
      expect(res.body[0]).toHaveProperty('sessions');
      // 完善expect的判断信息
    });

    // ------------------getBookingsByMonth-------------------
    // getBookingsByMonth最后写，需要添加session, 添加booking, 在session中添加booking后，再测试。
    // const getBookingsByMonth = async () =>
    //   request.get('/api/bookings/monthly/2021/09');

    // it('should return 201 if request is valid', async () => {
    //   const res = await getBookingsByMonth();
    //   expect(res.statusCode).toBe(200);
    //   expect(res.body.length).toEqual(1);
    //   expect(res.body[0]).toHaveProperty('sessions');
    // });

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
          const res = await getAllBookings();
          requestValue = res.body[0]._id;
          // console.log(requestValue);
        }
        const res = await getBookingsByArgs(param, requestValue);
        expect(res.statusCode).toBe(200);
        // console.log(res.body);
        const expectedValue = param === 'bookingdate'
          ? `${requestValue}T00:00:00.000Z`
          : requestValue;
        expect(res.body[0][field]).toEqual(expectedValue);
      },
    );

    it('should return 200 when id is valid', async () => {
      const res = await getAllBookings();
      const ids = res.body[0]._id;
    });
  });

  // ======================= UPDATE BOOKING ===================

  // ======================= DELETE BOOKING ===================
});
