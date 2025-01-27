import { useRouter, usePathname } from 'next/navigation';

function SideLink({ children, href }: { children: React.ReactNode; href: string }) {
  const router = useRouter();
  const path = usePathname();

  const isDashboard = href == '/dashboard';
  let className = isDashboard
    ? path === href
      ? 'bg-redpraha text-white'
      : 'text-zinc-100 hover:bg-midnight'
    : path && path.includes(href)
    ? 'bg-redpraha text-white'
    : 'text-zinc-100 hover:bg-midnight';

  className += ' group flex items-center px-3 py-2 text-base rounded-xl';

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export default SideLink;
