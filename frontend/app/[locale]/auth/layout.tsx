import {ReactNode} from 'react';
import './auth.css'

export const metadata = {
    title: 'SafeFledge',
    description: 'For sake of better air travel!',
  }

  
  type Props = {
    children: ReactNode;
  };
  


export default async function AuthLayout({
    children,
}: Props) {
    return (
        <section>
            {children}
        </section>
    )
}