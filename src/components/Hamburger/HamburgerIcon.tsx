'use client';

export default function HamburgerIcon() {
  return (
    <div className="fixed top-12 right-12 flex h-7 w-auto flex-col justify-between">
      <div className="h-[.375rem] w-10 bg-dark-blue"></div>
      <div className="h-[.375rem] w-[1.875rem] bg-gradient-to-t from-light-blue to-dark-blue"></div>
      <div className="h-[.375rem] w-5 bg-light-blue"></div>
    </div>
  );
}
