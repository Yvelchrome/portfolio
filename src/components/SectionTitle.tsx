'use client';

export default function SectionTitle({
    number,
    title,
}: {
    number: string;
    title: string;
}) {
    return (
        <div className="my-12">
            <p className="font-roobert text-sm font-semibold text-light-grey">
                {number}
            </p>
            <h2 className="font-roobert text-base font-medium text-black">
                {title}
            </h2>
        </div>
    );
}
