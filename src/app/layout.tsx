import Providers from './Providers';
import meta from './metadata';

export const metadata = meta;

export default function RootLayout({ children }: { children: JSX.Element }) {
  return (
    <html lang='en'>
      <body className='text-white bg-midnight'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}