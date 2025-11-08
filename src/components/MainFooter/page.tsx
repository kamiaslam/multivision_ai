'use client'
import React, { useState } from 'react'
import Link from "next/link";

export default function Footer()
 {
    const [email, setEmail] = useState("");
        const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
        <footer className="dark:bg-[#0F172A] bg-[#fff] py-[20px] md:py-[64px] px-[24px] relative z-20">
                <div className="max-w-[1120px] mx-auto flex flex-col gap-[30px] md:gap-[64px]">
                    <div className="my-shape-top footer-left"></div>
                    <div className="my-shape-top footer-right"></div>
                    <div className="flex justify-between items-center relative z-20">
                        <div className="flex items-center">
                            <span className="text-lg sm:text-xl font-bold tracking-tight">
                              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                Multivision
                              </span>
                              <span className="text-[#0F172A] dark:text-[#FDFCFB] ml-1">AI</span>
                            </span>
                        </div>
                        <div className="w-full flex gap-[24px] justify-end">
                            <Link href="">
                                <img src="/images/twittericon.png" className="w-[24px] h-[24px] object-contain invert dark:invert-0 cursor-pointer" alt="" />
                            </Link>
                            <Link href="">
                                <img src="/images/instaicon.png" className="w-[24px] h-[24px] object-contain invert dark:invert-0 cursor-pointer" alt="" />
                            </Link>
                            <Link href="">
                                <img src="/images/facebookicon.png" className="w-[24px] h-[24px] object-contain invert dark:invert-0 cursor-pointer" alt="" />
                            </Link>
                            <Link href="">
                                <img src="/images/linkedinicon.png" className="w-[24px] h-[24px] object-contain invert dark:invert-0 cursor-pointer" alt="" />
                            </Link>
                        </div>
                    </div>
                    <div className="w-full relative z-20">
                        {/* Newsletter */}
                        <div className="flex flex-col md:flex-row gap-[40px] justify-center items-center">
                            <h3 className="dark:text-[#FDFCFB] text-[#0F172A] text-center text-[30px] md:text-[52px] font-instrument font-w-thin leading-[100%] tracking-[-1.04px]">Join Our Newsletter</h3>
                            <div className="flex justify-between w-full max-w-[432px] h-[42px] min-w-[80px] pl-[16px] pr-[3px] py-[6px] items-center gap-1 rounded-full border border-[#82D7FF]">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="placeholder-gray-400 focus:outline-none focus:ring-0"
                                />
                                <button className="inline-flex h-[36px] min-w-[80px] px-[12px] py-[6px] justify-center items-center gap-1 shrink-0 rounded-[100px] bg-[linear-gradient(85deg,#82D7FF_6.31%,#19B95A_77.97%)] font-open-sans font-bold text-[#1B1818]">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t dark:border-t-[#FDFCFB] border-t-[#0F172A] pt-[30px] md:pt-[64px] relative z-0">
                        <div className="flex justify-between items-center flex-col md:flex-row gap-[10px] md:gap-[0px]">
                            <div className="w-full max-w-fit">
                                <p className="dark:text-[#FDFCFB] text-[#0F172A]   font-open-sans text-[14px] not-italic font-normal leading-[24px] tracking-[-0.28px]">©️ 2025 All Rights Reserved </p>

                            </div>
                            <div className="flex justify-end gap-[64px]">
                                <Link href="/privacy-policy" className="dark:text-[#FDFCFB] text-[#0F172A] font-open-sans text-[12px] md:text-sm font-normal leading-6 tracking-tight">Privacy Policy</Link>
                                <Link href="/terms-&-conditions" className="dark:text-[#FDFCFB] text-[#0F172A] font-open-sans text-[12px] md:text-sm font-normal leading-6 tracking-tight">Terms & Condition</Link>
                                <Link href="/faq" className="dark:text-[#FDFCFB] text-[#0F172A] font-open-sans text-[12px] md:text-sm font-normal leading-6 tracking-tight">Security Policy</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
  )
}
