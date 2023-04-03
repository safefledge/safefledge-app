import {ReactNode} from 'react';

type Props = {
  children: ReactNode;
};

export default function RootLayout({children}: Props) {

  const lang = undefined;

  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}