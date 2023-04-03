import {createIntlMiddleware} from 'next-intl/server';
 

export default createIntlMiddleware({
  locales: ['en', 'pl', 'ua', 'es', 'de', 'cs', 'por'],
  defaultLocale: 'en'
});



export const config = {
  matcher: ['/((?!api|_next|favicon.ico|assets).*)']
}