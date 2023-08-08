import 'dotenv/config';

const URL_DATABASE = process.env.URL_DATABASE as string;
const ALLOWED = process.env.ALLOWED as string;
const PALABRA = process.env.PALABRA as string;

export {URL_DATABASE, ALLOWED, PALABRA}