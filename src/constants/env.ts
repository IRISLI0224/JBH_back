// eslint-disable-next-line import/prefer-default-export
export const JWT_KEY = process.env.NODE_ENV === 'production' ? process.env.JWT_KEY : 'secret';
