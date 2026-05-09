import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: number;
  showText?: boolean;
  href?: string;
  className?: string;
}

export function Logo({ size = 40, showText = true, href = '/', className }: LogoProps) {
  return (
    <Link href={href} className={cn('flex items-center gap-3', className)}>
      <Image
        src="/logo.webp"
        alt="Quetzalito"
        width={size}
        height={size}
        priority
        className="select-none"
      />
      {showText && (
        <div className="leading-tight">
          <p className="text-lg font-bold tracking-tight text-brand-600 dark:text-brand-400">
            Quetzalito
          </p>
          <p className="text-[11px] text-muted -mt-0.5">Tu dinero bajo control</p>
        </div>
      )}
    </Link>
  );
}
