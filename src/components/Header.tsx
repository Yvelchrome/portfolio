'use client';

import { Logo, HamburgerIcon, ThemeSwitch } from 'components';

export default function Header() {
    return (
        <header>
            <Logo />
            <HamburgerIcon />
            <ThemeSwitch />
        </header>
    );
}
