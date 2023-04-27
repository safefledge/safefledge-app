import {NextIntlClientProvider} from 'next-intl/client';
import {notFound} from 'next/navigation';
import {ReactNode} from 'react';
import './globals.css'
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from '@/components/Navbar';


export const metadata = {
  title: 'SafeFledge',
  description: 'For sake of better air travel!',
}

type Props = {
  children: ReactNode;
  params: {locale: string};
};



export default async function LocaleLayout({
  children,
  params: {locale}
}: Props) {
  let messages;
  try {
    messages = (await import(`../../translation/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
 {
  return (
    <NextIntlClientProvider
     locale={locale}
      messages={messages}
      formats={{
        dateTime: {
          short: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }
        }, 
        number: {
          currency: {
            style: 'currency',
            currency: 'USD',
          },
          percent: {
            style: 'percent',
          },
          precise: {
            maximumFractionDigits: 2,
          }
        }
      }}
      >
      <section>
        <main>
          {children}
          </main>
      </section>
    </NextIntlClientProvider>
  )
}
}
