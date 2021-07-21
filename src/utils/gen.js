const genBookingNum = () => {
  const prefix = 'DBJ';
  let middle = '';
  for (let i = 0; i < 3; i += 1) {
    middle += Math.floor(Math.random() * 10);
  }
  const timeString = Date.now().toString();
  const tail = timeString.substring(timeString.length - 6);
  const bookingNum = prefix + middle + tail;
  return bookingNum;
};

module.exports = {
  genBookingNum,
};
