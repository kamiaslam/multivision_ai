'use client'
import React, { useState } from 'react'
import Logo from '../Logo'
import ThemeButton from '../ThemeButton'
import Icon from '../Icon'
import Link from "next/link";
import Button from '../Button'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Enhanced smooth scroll function with custom easing
    const smoothScrollTo = (elementId: string) => {
        const element = document.getElementById(elementId);
        if (element) {
            const headerHeight = 120; // Account for fixed header
            const elementPosition = element.offsetTop - headerHeight;
            
            // Custom easing function for smoother animation
            const easeInOutCubic = (t: number): number => {
                return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            };

            const startPosition = window.pageYOffset;
            const distance = elementPosition - startPosition;
            const duration = 800; // Animation duration in ms
            let start: number | null = null;

            const animation = (currentTime: number) => {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = easeInOutCubic(progress);
                
                window.scrollTo(0, startPosition + distance * ease);
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            };

            requestAnimationFrame(animation);
        }
    };


  return (
      <header className="fixed top-[40px] left-0 right-0 z-50 px-[24px] ">
                <div className={`max-w-[990px] mx-auto px-4 sm:px-6 py-4 bg-b-surface2 shadow-lg rounded-[${mobileMenuOpen ? "20px": "90px"}] md:rounded-[90px] relative`}>
                    <div className="flex items-center justify-between">
                        <Logo className="w-[64px] h-[44px] sm:h-12" />

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <button 
                                onClick={() => smoothScrollTo('products')} 
                                className="font-open-sans text-sm hover:text-t-secondary transition-colors cursor-pointer"
                            >
                                Product
                            </button>
                            <button 
                                onClick={() => smoothScrollTo('solutions')} 
                                className="font-open-sans text-sm hover:text-t-secondary transition-colors cursor-pointer"
                            >
                                Solutions
                            </button>
                            <button 
                                onClick={() => smoothScrollTo('pricing')} 
                                className="font-open-sans text-sm hover:text-t-secondary transition-colors cursor-pointer"
                            >
                                Pricing
                            </button>
                            <button 
                                onClick={() => smoothScrollTo('resources')} 
                                className="font-open-sans text-sm hover:text-t-secondary transition-colors cursor-pointer"
                            >
                                Resources
                            </button>
                            <button 
                                onClick={() => smoothScrollTo('home')} 
                                className="font-open-sans text-sm hover:text-t-secondary transition-colors cursor-pointer"
                            >
                                Company
                            </button>
                        </nav>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            <ThemeButton rowProps='flex-row w-22' className="absolute right-[-125px] dark:bg-b-surface2 shadow-lg" />
                            <Link href="/auth/signin" className="text-xs font-open-sans hover:text-t-secondary transition-colors">
                                Sign in
                            </Link>
                            <button className="text-[#0F172A] font-open-sans rounded-[100px] bg-[linear-gradient(85deg,#82D7FF_6.31%,#19B95A_77.97%)] w-[150px] h-[36px] flex justify-center items-center text-sm font-bold">
                                Open Dashboard
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-[#000] dark:text-[#fff] font-bold"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <Icon name={mobileMenuOpen ? "close" : "menu"} className="w-[30px] h-[30px] " />
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 border-t border-s-border">
                            <nav className="flex flex-col space-y-4 mt-4">
                                <button
                                    onClick={() => {
                                        smoothScrollTo('products');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-t-primary hover:text-t-secondary transition-colors py-2 text-left cursor-pointer"
                                >
                                    Product
                                </button>
                                <button
                                    onClick={() => {
                                        smoothScrollTo('solutions');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-t-primary hover:text-t-secondary transition-colors py-2 text-left cursor-pointer"
                                >
                                    Solutions
                                </button>
                                <button
                                    onClick={() => {
                                        smoothScrollTo('pricing');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-t-primary hover:text-t-secondary transition-colors py-2 text-left cursor-pointer"
                                >
                                    Pricing
                                </button>
                                <button
                                    onClick={() => {
                                        smoothScrollTo('resources');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-t-primary hover:text-t-secondary transition-colors py-2 text-left cursor-pointer"
                                >
                                    Resources
                                </button>
                                <button
                                    onClick={() => {
                                        smoothScrollTo('home');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-t-primary hover:text-t-secondary transition-colors py-2 text-left cursor-pointer"
                                >
                                    Company
                                </button>
                            </nav>
                            <div className="flex flex-col space-y-3 mt-4 pt-4 border-t border-s-border">
                                <div className="flex justify-start md:justify-center">
                                    <ThemeButton rowProps='flex-row w-22 shadow-lg' />
                                </div>
                                <Link
                                    href="/auth/signin"
                                    className="text-t-primary hover:text-t-secondary transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign in
                                </Link>
                                <Button className="w-full">
                                    Book a demo
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

  )
}
