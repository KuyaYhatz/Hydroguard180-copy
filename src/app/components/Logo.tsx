import logo from "figma:asset/1d4f321f8b4e871551b7ad7264cb64d51e35cfb0.png";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  return (
    <img 
      src={logo} 
      alt="Hydro Guard 180 Logo" 
      className={`${sizes[size]} ${className}`}
    />
  );
}
