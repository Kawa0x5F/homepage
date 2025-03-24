import Link from "next/link";
import Image from "next/image";

type FooterProps = {
  siteName: string;
  adminName: string;
};

const Footer: React.FC<FooterProps> = ({ siteName, adminName }) => {
  return (
    <footer className="w-full bg-white border-t mt-auto py-6">
      <div className="max-w-5xl mx-auto px-4 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center mb-3">
          <Link href="/">
            <Image
              src="/images/kawa_logo.png"
              alt="Kawa Logo"
              width={40}
              height={40}
              className="rounded-full mr-2 cursor-pointer"
            />
          </Link>
          <span className="font-medium">{siteName}</span>
        </div>
        &copy; {new Date().getFullYear()} {adminName} All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
