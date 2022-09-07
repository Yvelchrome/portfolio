function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="my-12">
      <h3 className="font-roobert-600 text-sm text-gray-500">{number}</h3>
      <h2 className="font-roobert-500 text-base text-black">{title}</h2>
    </div>
  );
}

export default SectionTitle;
