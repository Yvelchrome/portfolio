function HamburgerIcon() {
  return (
    <div className="fixed top-12 right-12 flex h-7 w-auto flex-col justify-between">
      <div className="h-[.375rem] w-10 bg-sky-600"></div>
      <div className="h-[.375rem] w-[1.875rem] bg-gradient-to-t from-sky-400 to-sky-600"></div>
      <div className="h-[.375rem] w-5 bg-sky-400"></div>
    </div>
  );
}

export default HamburgerIcon;
