import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="container-main bg-background flex items-center justify-center py-25">
      <div className="w-full max-w-[80%] lg:max-w-[1440px]">{children}</div>
    </div>
  );
}
