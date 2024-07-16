'use client';

import Image from 'next/legacy/image';
import logo from 'images/logo.svg';
import Link from 'next/link';

export default function Logo() {
    return (
        <Link href={'/'}>
            <div className="fixed top-12 left-12">
                <Image src={logo} alt="" width={40} height={75} />
            </div>
        </Link>
    );
}
