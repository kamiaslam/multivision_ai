"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "@/components/Image";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Badge from "@/components/Badge";
import Field from "@/components/Field";
import Logo from "@/components/Logo";
import ThemeButton from "@/components/ThemeButton";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import Header from "@/components/MainHeader/Header";
import Footer from "@/components/MainFooter/page";
import AudioPlayer from "./_components/AudioPlayer";

const LandingPage = () => {
    const [email, setEmail] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedAgancyIndex, setSelectedAgancyIndex] = useState<Number>(0);

    const whyVoicecakeFeatures = [
        {
            image: "/images/Buttonbase.png",
            title: "Outcome first",
            description: "Teams report dramatic lifts in satisfaction, often 10x, with some feedback showing 10 to 100x, and clear gains in conversion and revenue"
        },
        {
            image: "/images/cloudebutton.png",
            title: "All in one suite",
            description: "Create the agent, design the logic and publish, without leaving the platform or hiring a developer"
        },
        {
            image: "/images/indexbutton.png",
            title: "International by design",
            description: "English, Arabic and other major languages for web and telephony, with GCC dialect coverage where you need it"
        },
        {
            image: "/images/copybutton.png",
            title: "Fast to live",
            description: "No development knowledge needed, you can be up and running in minutes"
        },
        {
            image: "/images/musicbutton.png",
            title: "Transparent pricing",
            description: "No hidden charges, our natural voice collection is included, what you see is what you pay"
        },
        {
            image: "/images/mailbutton.png",
            title: "Trusted already",
            description: "Hundreds of customers across global markets, including leaders in the GCC"
        }
    ];

    const agentSuite = [
        {
            Image: "/images/girl-avtar.png",
            Image1: "/images/musicbutton.svg",
            Image2: "/images/music-waves.svg",
            name: "Sahla",
            audio: "/voices/combined-Arabic.mp3",
            description: "Sahla is our leading Arabic business agent, fluent in GCC dialects and English. She knows local customs and adheres to GCC laws, making her ideal for banking, healthcare, hospitality, and retail in KSA, UAE, Qatar, Kuwait, Bahrain, and Oman."
        },
        {
            Image: "/images/second-avtar.png",
            Image1: "/images/musicbutton.svg",
            Image2: "/images/music-waves.svg",
            bottomImage: "/images/media icons.png",
            name: "Conversa",
            audio: "/voices/conversa.wav",
            description: "Perfect for announcements, proactive outreach and guided flows. Conversa gives you crystal clear, on brand delivery, hands off to your team when needed, and stays compliant by design."

        },
        {
            Image: "/images/thrid-avtar.png",
            Image1: "/images/musicbutton.svg",
            Image2: "/images/music-waves.svg",
            bottomImage: "/images/media icons.png",
            name: "Empth",
            audio: "/voices/Empth.wav",
            description: "Built for open ended conversations in voice and chat. Empth understands intent, keeps context, negotiates next steps and resolves, on your site or your phone lines."
        }
    ];

    const howItWorks = [
        {
            step: "/images/boaticon.png",
            title: "Create your agent",
            description: "Pick Conversa, Empth or Sahla, choose a voice and tone, add knowledge and guardrails, preview immediately"
        },
        {
            step: "/images/creativesletter.png",
            title: "Connect channels",
            description: "Point phone numbers to your agent, drop the voice and chat widget on your website, switch on WhatsApp, SMS and email"
        },
        {
            step: "/images/curvyes.png",
            title: "Automate the journey",
            description: "Use Sim AI to qualify, book, verify, update your CRM and escalate to your team with full transcripts and context"
        },
        {
            step: "/images/scaleimage.png",
            title: "Measure and improve",
            description: "Track containment, resolution, conversion, cost and satisfaction signals, then iterate with safe to test variants"
        }
    ];

    const useCases = [
        {
            image: "/images/customerimage.png",
            link: "Project",
            title: "Customer support",
            description: "24/7 answers, proactive updates, smooth escalation, lower costs"
        },
        {
            image: "/images/stikey.png",
            link: "Lead",
            title: "Sales and growth",
            description: "Lead capture, qualification, instant callbacks and scheduling, faster response, higher conversion"
        },
        {
            image: "/images/financeimage.png",
            link: "Finance",
            title: "E-commerce and retail",
            description: "Order status, returns, back in stock alerts, personalised recommendations"
        },
        {
            image: "/images/financ-service-image.png",
            link: "Project",
            title: "Financial services",
            description: "KYC checks, appointment booking, card issues, balance or application status with secure handoff"
        },
        {
            image: "/images/healthcareimage.png",
            link: "Lead",
            title: "Healthcare",
            description: "Intake, triage, appointment scheduling, reminders and lab result follow ups"
        },
        {
            image: "/images/hospitality.png",
            link: "Finance",
            title: "Hospitality and travel",
            description: "Reservations, itinerary changes, real time service requests, concierge"
        }
    ];

    const comparisonData = [
        {
            platform: "Voicecake.io",
            phoneVoice: "✓",
            webChat: "✓",
            visualAutomation: "✓",
            gptAssisted: "✓",
            arabicGcc: "✓",
            voiceLibrary: "✓",
            approach: "All-in-one platform"
        },
        {
            platform: "Bland.ai",
            phoneVoice: "✓",
            webChat: "Partial",
            visualAutomation: "✗",
            gptAssisted: "Partial",
            arabicGcc: "✗",
            voiceLibrary: "✗",
            approach: "Phone calls only"
        },
        {
            platform: "Vapi",
            phoneVoice: "✓",
            webChat: "✗",
            visualAutomation: "✗",
            gptAssisted: "✗",
            arabicGcc: "✗",
            voiceLibrary: "✗",
            approach: "Developer API"
        },
        {
            platform: "Retell AI",
            phoneVoice: "✓",
            webChat: "✓",
            visualAutomation: "✗",
            gptAssisted: "Partial",
            arabicGcc: "✗",
            voiceLibrary: "✗",
            approach: "Basic voice & chat"
        },
        {
            platform: "ElevenLabs",
            phoneVoice: "Partial",
            webChat: "Partial",
            visualAutomation: "✗",
            gptAssisted: "Partial",
            arabicGcc: "✗",
            voiceLibrary: "✗",
            approach: "Voice generation"
        },
        {
            platform: "n8n",
            phoneVoice: "✗",
            webChat: "✗",
            visualAutomation: "✓",
            gptAssisted: "✓",
            arabicGcc: "✗",
            voiceLibrary: "✗",
            approach: "Automation only"
        },
        {
            platform: "Make.com",
            phoneVoice: "✗",
            webChat: "✗",
            visualAutomation: "✓",
            gptAssisted: "✓",
            arabicGcc: "✗",
            voiceLibrary: "✗",
            approach: "Automation only"
        }
    ];

    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            icon: "/images/CaretDown.svg",
            question: "Do we need engineers to deploy?",
            answer: "No. Most teams go live in minutes. Connect your numbers, paste the site widget, pick a voice and publish. Our team helps you fine tune flows without code."
        },
        {
            icon: "/images/CaretDown.svg",
            question: "How do Conversa, Empth and Sahla differ?",
            answer: "Use Conversa for precise scripted voice or rich chat, Empth for real time, open ended conversations that resolve, Sahla when you need native Arabic across GCC dialects with effortless switching to English."
        },
        {
            icon: "/images/CaretDown.svg",
            question: "Will this work with our current stack?",
            answer: "Yes. Voicecake integrates with CRM, email, WhatsApp and SMS, and supports secure webhooks and APIs for custom systems."
        },
        {
            icon: "/images/CaretDown.svg",
            question: "How do your voices compare?",
            answer: "We offer ultra realistic voices that are prompt controlled for tone and personality. Our natural voice collection is included in platform pricing. Some vendors use credit tiers or charge extra for advanced voices or LLM pass through. With us there are no hidden add ons."
        }
    ];

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="min-h-screen bg-b-surface1 overflow-hidden" style={{ 
            scrollBehavior: 'smooth',
            scrollPaddingTop: '120px' // Account for fixed header height
        }}>
            {/* Header/Navigation */}
            {/* <header className="fixed top-[40px] left-0 right-0 z-50 px-[24px] ">
                <div className={`max-w-[990px] mx-auto px-4 sm:px-6 py-4 bg-white dark:bg-black md:dark:bg-white rounded-[${mobileMenuOpen ? "20px": "90px"}] md:rounded-[90px] relative`}>
                    <div className="flex items-center justify-between">
                        <Logo className="w-[64px] h-[44px] sm:h-12" />

                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#products" className="text-[#000] font-open-sans text-sm hover:text-t-secondary transition-colors">
                                Product
                            </a>
                            <a href="#solutions" className="text-[#000] font-open-sans text-sm hover:text-t-secondary transition-colors">
                                Solutions
                            </a>
                            <a href="#pricing" className="text-[#000] font-open-sans text-sm hover:text-t-secondary transition-colors">
                                Pricing
                            </a>
                            <a href="#resources" className="text-[#000] font-open-sans text-sm hover:text-t-secondary transition-colors">
                                Resources
                            </a>
                            <a href="#home" className="text-[#000] font-open-sans text-sm hover:text-t-secondary transition-colors">
                                Company
                            </a>
                        </nav>

                        <div className="hidden md:flex items-center space-x-4">
                            <ThemeButton rowProps="flex-row w-22" className="absolute right-[-125px]" />
                            <Link href="/auth/signin" className="text-xs font-open-sans text-[#000] hover:text-t-secondary transition-colors">
                                Sign in
                            </Link>
                            <button className="text-[#0F172A] font-open-sans rounded-[100px] bg-[linear-gradient(85deg,#82D7FF_6.31%,#19B95A_77.97%)] w-[150px] h-[36px] flex justify-center items-center text-sm font-bold">
                                Open Dashboard
                            </button>
                        </div>

                        <button
                            className="md:hidden p-2 text-[#000] dark:text-[#fff] font-bold"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <Icon name={mobileMenuOpen ? "close" : "menu"} className="w-[30px] h-[30px] " />
                        </button>
                    </div>


                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 border-t border-s-border">
                            <nav className="flex flex-col space-y-4 mt-4">
                                <a
                                    href="#products"
                                    className="text-t-primary hover:text-t-secondary transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Product
                                </a>
                                <a
                                    href="#solutions"
                                    className="text-t-primary hover:text-t-secondary transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Solutions
                                </a>
                                <a
                                    href="#pricing"
                                    className="text-t-primary hover:text-t-secondary transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Pricing
                                </a>
                                <a
                                    href="#resources"
                                    className="text-t-primary hover:text-t-secondary transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Resources
                                </a>
                                <a
                                    href="#home"
                                    className="text-t-primary hover:text-t-secondary transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Company
                                </a>
                            </nav>
                            <div className="flex flex-col space-y-3 mt-4 pt-4 border-t border-s-border">
                                <div className="flex justify-start md:justify-center">
                                    <ThemeButton />
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
            </header> */}

            <Header />

            {/* Hero Section */}
            <section id="home" className="hero-section homepage-hero-section pt-[200px] pb-[40px] md:pt-[250px] lg:pt-[250px] md:-b-[50px] lg:pb-20 h-[100%] dark:bg-[#0F172A] bg-[#fff] relative">
                <div className="my-shape-top banner"></div>
                <div className="max-w-[871px] w-full mx-auto px-4 md:px-6 text-center leading-[125%] relative z-0">
                    <h1 className="text-[40px] md:text-[52px] font-instrument font-normal dark:text-white text-[#0F172A] leading-[40px] md:leading-[52px] tracking-[-3.04px] mb-[24px]">
                        Turn every call and click into revenue, with AI voice, chat and automations in one platform
                    </h1>
                    <p className="dark:text-[#B9B9B9] text-[#414141] text-center font-open-sans text-base leading-[125%] mb-[40px]">
                        Launch human sounding voice bots and website chat that solve, sell and support, across your phone lines and your site, anywhere in the world. Go live in minutes, integrate with your stack in a few clicks, and scale globally, including native Arabic across major GCC dialects plus English. Speak to the bot on this page any time for a live demo and quick answers.
                    </p>

                    {/* Animation after text */}
                    <div className="flex justify-center mb-6 md:mb-8">
                        <div style={{ height: '150px', width: '150px' }}>
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover rounded-full"
                            >
                                <source src="/images/animations/01.mp4" type="video/mp4" />
                            </video>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 justify-center mb-6 md:mb-8 px-4">
                        <Link href="/auth/signup">
                            <button className="flex justify-center items-center text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 h-10 sm:h-12 md:h-14 font-open-sans bg-gray-900 text-[#fff] dark:bg-white dark:text-gray-900 hover:bg-gray-100 rounded-[90px] w-full">
                                Get Started
                            </button>
                        </Link>
                        {/* <button className=" flex justify-center items-center text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 h-10 sm:h-12 md:h-14 bg-transparent border-2 font-open-sans dark:border-white dark:text-white rounded-[90px] hover:bg-white hover:text-gray-900">
                            Book a Demo
                        </button> */}
                    </div>

                    {/* <div className="text-center mb-[20px] md:mb-16">
                        <p className="text-xs sm:text-sm md:text-base text-[#0F172A] dark:text-gray-300 mb-2">VoiceCake.io</p>
                    </div> */}
                </div>
            </section>
            {/* Agent Suite Section  slider */}
            <section id="products" className="pb-[30px] pt-[0px] md:py-[40px] lg:py-20 dark:bg-[#0F172A] bg-[#fff] swiper-section overflow-hidden">
                <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6">
                    <div className="text-center mb-[100px] sm:mb-[150px]">
                        <h2 className="text-[30px] md:text-[52px] font-instrument font-w-thin dark:text-white text-[#0F172A] leading-[52px] tracking-[-3.04px] mb-[24px]">
                            Meet the Voicecake<span className="highlighted-heading text-[#0F172A] dark:text-[#82D7FF] font-instrument font-w-thin "> Agent Suite</span>
                        </h2>
                    </div>
                    <Swiper
                        slidesPerView={2.5}
                        spaceBetween={20}
                        breakpoints={{
                            0: { // Mobile
                                slidesPerView: 1,
                            },
                            768: { // Tablet
                                slidesPerView: 1.5,
                            },
                            1024: { // Desktop
                                slidesPerView: 2.5,
                            },
                        }}
                        className="featured-slider"
                    >
                        <div className="space-y-6 sm:space-y-8">
                            {agentSuite.map((agent, index) => (
                                <SwiperSlide key={index}>
                                    <div key={index} className="flex flex-col p-[28px] rounded-[30px] border border-[#757279] bg-[#0F172A] dark:bg-[var(--secondary-secondary-5,rgba(245,238,255,0.05))]">
                                        <div className="flex flex-col gap-[40px]">
                                            <div className="w-full min-h-[293px] max-h-[293px] rounded-[30px] bg-[linear-gradient(174deg,#82D7FF_18.48%,#19B95A_91.1%)] relative ">
                                                <img src={agent.Image} alt="agent-image" className="object-cover object-top w-[100%] h-full absolute bottom-[0px] min-h-[450px]" />
                                            </div>
                                            <div className="flex flex-col w-full">
                                                <h3 className="dark:text-[#F5EEFF)] text-[#fff] font-open-sans text-[30px] font-bold leading-[30px] mb-[20px]">{agent.name}</h3>
                                                <p className="dark:text-[#F5EEFF] text-[#fff] font-['Open_Sans'] text-[16px] font-normal leading-[24px] line-clamp-3">
                                                    {agent.description}
                                                </p>
                                            </div>
                                            {/* <div className="w-full flex gap-[30px] items-center">
                                                <div className="w-[78px] h-[78px]">
                                                    <img src={agent.Image1} className="w-full h-[100%] object-contain" alt="" />
                                                </div>
                                                <div className="w-full">
                                                    <img src={agent.Image2} className="w-full h-auto object-contain" alt="" />
                                                </div>
                                            </div> */}
                                            <AudioPlayer audio={agent.audio} />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </div></Swiper>
                </div>
            </section>
            {/*video section */}
            <section className="py-[30px] md:py-[40px] lg:py-20 dark:bg-[#0F172A] bg-[#fff] swiper-section relative px-[24px]">
                <div className="my-shape-top"></div>
                <div className="my-shape-bottom"></div>
                <div className="max-w-[929px] w-full mx-auto p-[16px] rounded-[30px] border-2 border-[#82D7FF] bg-[Linear,_linear-gradient(85deg,#82D7FF_6.31%,#19B95A_77.97%] dark:border-[#82D7FF)] dark:bg-[var(--secondary-secondary-5,rgba(245,238,255,0.05))] 
           ">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                        <video
                            id="landing-video"
                            className="w-full h-full object-cover bg-[#020D22] border rounded-[20px]"
                            autoPlay
                            muted
                            loop
                            playsInline
                            poster="/thumbnail.jpg"
                        >
                            <source src="/landing-page-video/Voicecake-final.mp4" type="video/mp4" />
                            <p className="text-[#FDFCFB)] text-center text-[28px] leading-[28px] tracking-[-0.56px]">Your browser does not support the video tag.</p>
                        </video>
                        
                        {/* Custom Mute/Unmute Button */}
                        <button
                            id="mute-button"
                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
                            onClick={() => {
                                const video = document.getElementById('landing-video') as HTMLVideoElement;
                                const button = document.getElementById('mute-button');
                                if (video) {
                                    video.muted = !video.muted;
                                    if (button) {
                                        button.innerHTML = video.muted 
                                            ? '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L5.5 14H3a1 1 0 01-1-1V7a1 1 0 011-1h2.5l2.883-2.793A1 1 0 019.383 3.076zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>'
                                            : '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 28 28"><path fill="currentColor" d="M14.395 3.902c.798-.748 2.105-.182 2.105.912v18.37c0 1.094-1.306 1.66-2.105.912L9.458 19.47a1.75 1.75 0 0 0-1.196-.473H5.25A3.25 3.25 0 0 1 2 15.747v-3.492a3.25 3.25 0 0 1 3.25-3.25h3.011c.445 0 .873-.17 1.197-.473zm7.249 1.282a.75.75 0 0 1 1.058.068A13.2 13.2 0 0 1 26 14c0 3.352-1.246 6.414-3.298 8.747a.75.75 0 1 1-1.126-.99A11.7 11.7 0 0 0 24.5 14a11.7 11.7 0 0 0-2.924-7.757a.75.75 0 0 1 .068-1.059m-1.291 3.119a.75.75 0 1 0-1.2.9A7.96 7.96 0 0 1 20.75 14c0 1.8-.594 3.46-1.597 4.797a.75.75 0 1 0 1.2.9A9.46 9.46 0 0 0 22.25 14a9.46 9.46 0 0 0-1.897-5.697"></path></svg>';
                                    }
                                }
                            }}
                        >
                            {/* Muted Icon (Default) */}
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L5.5 14H3a1 1 0 01-1-1V7a1 1 0 011-1h2.5l2.883-2.793A1 1 0 019.383 3.076zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                        </button>


                    </div>
                    <p className="mt-2 text-[28px] dark:text-gray-300 text-[#020D22] text-center font-instrument font-w-thin">
                        The most realistic voice AI platform
                    </p>
                </div>
            </section>
            <section id="solutions" className="py-[40px] md:py-20 pb-[60px] md:pb-[60px] lg:pb-[160px] dark:bg-[#0F172A] bg-[#fff] swiper-section relative">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                    <div className="text-center mb:[20px] md:mb-[30px] lg:mb-12">
                        <h2 className="text-[30px] md:text-[52px] font-instrument font-w-thin dark:text-white text-[#020D22] leading-[52px] tracking-[-3.04px] mb-[24px]">
                            Why<span className="highlighted-heading text-[#020D22] dark:text-[#82D7FF] font-instrument font-w-thin"> Voicecake.io</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {whyVoicecakeFeatures.map((feature, index) => (
                            <div key={index} className="rounded-[30px] border-2 border-[#1F2E4E] dark:bg-[rgba(245,238,255,0.05)] bg-[#0F172A] backdrop-blur-[43.35px] p-[30px] min-h-[292px] flex flex-col gap-[30px]">
                                <div className="w-full max-w-[56px] h-[56px]">
                                    <img src={feature.image} alt="" />
                                </div>
                                <div className="w-full">
                                    <h3 className="text-[#FDFCFB] font-open-sans text-[22px] font-bold leading-[30px] mb-[20px]">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[#B5B5B5] font-open-sans text-[16px] font-normal leading-[24px]">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sim AI Section */}
            <section className="py-[40px] md:py-[65px] bg-[#82D7FF] relative">
                <img src="./images/bg-animation.png" className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 transform" alt="" />
                <div className="max-w-[1122px] mx-auto px-6">
                    <div className="text-center mb-[20px] md:mb-[30px] lg:mb-16">
                        <h2 className="text-[30px] md:text-[52px] text-[#0F172A] font-instrument font-w-thin mb-[27px] w-full max-w-[580px] m-auto leading-[30px] md:leading-[52px] tracking-[-3.04px]">
                            <span className="highlighted-heading dark:text-[#0F172A] text-[#0F172A] hh-white text-[30px] md:text-[52px] font-instrument font-w-thin mb-[27px] w-full max-w-[552px] m-auto leading-[52px] tracking-[-3.04px]"> <span className="text-[30px] md:text-[52px] font-instrument font-w-thin relative z-10">Integrated automations,</span></span> without the third party tools
                        </h2>
                        <p className="text-lg text-[#7483A7] max-w-[967px] mx-auto">
                            Competitive stacks often ask you to stitch voice with separate automation tools like n8n or Make, then bring in developers to glue it all together. Voicecake includes Sim AI, a fully integrated automation studio inside the platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="rounded-[30px] bg-[#0F172A] backdrop-blur-[2px] p-[15px] flex flex-col gap-[20px]">
                            <div className="w-full">
                                <img src="./images/voice.png" alt="" />
                            </div>
                            <div className="w-full flex flex-col gap-[20px]">
                                <h3 className="text-center font-heading text-[27px] font-bold leading-[30px] text-[#FDFCFB] max-w-[409px] m-auto">
                                    Design powerful flows with clicks, conditions and actions, then publish instantly
                                </h3>
                                <p className="text-center font-Open-Sans text-[14px] font-normal leading-[18px] text-[#B1B1B1] w-full max-w-[381px] m-auto pb-[10px]">
                                    GPT connectivity inside Sim AI lets you build automations conversationally, as if you were chatting in ChatGPT, so non technical teams can ship complex logic fast
                                </p>
                            </div>
                            <div className="flex justify-center gap-[10px] items-center">
                                <a href="#" className="text-[#EFF8FF] font-open-sans text-sm font-medium leading-6">Sign in</a>
                                <a href="#" className="flex h-9 min-w-20 max-w-fit px-3 py-1.5 justify-center items-center gap-1 
rounded-full bg-gradient-to-r from-[#82D7FF] to-[#19B95A] 
text-[#1B1818] font-open-sans text-sm font-medium leading-6">Get Started</a>
                            </div>
                        </div>

                        <div className="rounded-[30px] bg-[#0F172A] backdrop-blur-[2px] p-[15px] flex flex-col gap-[20px]">
                            <div className="w-full">
                                <img src="./images/webhookimage.png" alt="" />
                            </div>
                            <div className="w-full flex flex-col gap-[20px]">
                                <h3 className="text-center font-heading text-[27px] font-bold leading-[30px] text-[#FDFCFB] max-w-[409px] m-auto">
                                    Connect your systems with secure webhooks and native connectors
                                </h3>
                                <p className="text-center font-Open-Sans text-[14px] font-normal leading-[18px] text-[#B1B1B1] w-full max-w-[381px] m-auto pb-[10px]">
                                    For CRM, WhatsApp, SMS and email. Stay in one place, no context switching, no brittle glue code, no extra vendors to manage.


                                    For teams familiar with n8n or Make, Sim AI brings that visual power directly into Voicecake, so you do not need separate tools.</p>

                            </div>
                            <div className="flex justify-center gap-[10px] items-center">
                                <a href="#" className="text-[#EFF8FF] font-open-sans text-sm font-medium leading-6">Sign in</a>
                                <a href="#" className="flex h-9 min-w-20 max-w-fit px-3 py-1.5 justify-center items-center gap-1 
rounded-full bg-gradient-to-r from-[#82D7FF] to-[#19B95A] 
text-[#1B1818] font-open-sans text-sm font-medium leading-6">Get Started</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="pt-[0px] pb-[0px] md:py-[20px] lg:py-[65px] bg-[#82D7FF] relative">
                <div className="max-w-[1240px] mx-auto px-6">
                    <div className="text-center mb-[20px] md:mb-[30px] lg:mb-16">
                        <h2 className="text-[30px] md:text-[52px] text-[#0F172A] font-instrument font-w-thin mb-[27px] w-full max-w-[552px] m-auto leading-[52px] tracking-[-3.04px]">
                            How it <span className="highlighted-heading-single dark:highlighted-heading font-instrument font-w-thin text-[#0F172A]">works</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {howItWorks.map((step, index) => (
                            <div key={index} className={`rounded-[57px] bg-[linear-gradient(180deg,#F1F8FF_0%,#82D7FF_90%)] p-[25px] flex flex-col ${index % 2 === 0 ? "card-gradiant" : "card-gradiant-rotate"}`}>
                                <div className={`w-[78px] h-[106px] flex items-center justify-center mx-auto ${index % 2 === 0 ? "" : "md:order-3"}`}>
                                    <img src={step.step} alt="" />
                                </div>
                                <h3 className={`text-[#0F172A] text-center font-open-sans text-[24px] font-semibold leading-[32px] tracking-[-0.48px] mb-[10px] ${index % 2 === 0 ? "" : "md:order-2"}`}>
                                    {step.title}
                                </h3>
                                <p className="text-[#6D7C9E] text-center font-open-sans text-base font-normal leading-[22px] tracking-tight ">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Voice Demo Section */}
            <section className="pt-[40px] md:pt-[65px] pb-[40px] md:pb-[60px] lg:pb-[118px] bg-[#82D7FF] relative">
                <img src="./images/bg-animation.png" className="absolute bottom-[-138px] left-1/2 -translate-x-1/2 transform" alt="" />
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-[20px] md:mb-[30px] lg:mb-16">
                        <h2 className="text-[30px] md:text-[52px] text-[#0F172A] font-instrument font-w-thin mb-[27px] w-full max-w-[552px] m-auto leading-[52px] tracking-[-3.04px]">
                            <span className="font-instrument font-w-thin our-voice-heading "><span className="relative z-10 font-instrument font-w-thin">Hear the difference,</span></span> test our voices
                        </h2>
                        <p className="text-[16px] text-[#7483A7] font-open-sans max-w-[750px] mx-auto leading-[20px]">
                            Experience ultra realistic voices that customers love. Every voice can be prompt controlled, so you set tone, pace, formality and persona in plain language. Unlike many platforms, you do not pay extra to unlock premium voices. Our natural voice collection is included, there are no surprise fees or add ons.
                        </p>
                        <div className="text-center mt-8">
                            <button className="flex h-9 min-w-20 px-3 py-1.5 justify-center items-center gap-1 self-stretch rounded-full bg-[#FDFCFB] text-[#1B1818] w-full max-w-[723px] mx-auto">
                                Try Voices
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[1134px] mx-auto">
                        <div className="flex w-full justify-between items-start shrink-0 rounded-[30px] relative overflow-hidden">
                            <div className="w-full">
                                <img src="/images/left-couple.png" className="min-h-[285px] object-cover w-[100%] h-[100%]" alt="" />
                            </div>
                            <div className="w-full absolute top-0 left-0 h-full flex justify-between items-start px-[20px] py-[35px]">
                                <h3 className="text-#fff] font-open-sans text-xl font-bold leading-7 max-w-[266px]">
                                    Try male and female voices across accents and languages
                                </h3>
                                <img src="/images/video-play.png" className="w-[54px] h-[54px] object-cover" alt="" />
                            </div>

                        </div>
                        <div className="flex w-full justify-between items-start shrink-0 rounded-[30px] relative overflow-hidden">
                            <div className="w-full">
                                <img src="/images/right-window.png" className="min-h-[285px] object-cover w-[100%] h-[100%]" alt="" />
                            </div>
                            <div className="w-full absolute top-0 left-0 h-full flex justify-between items-start px-[20px] py-[35px]">
                                <h3 className="text-#fff] font-open-sans text-xl font-bold leading-7 max-w-[266px]">
                                    Switch styles from warm concierge to efficient agent with a single prompt
                                </h3>
                                <img src="/images/video-play.png" className="w-[54px] h-[54px] object-cover" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section id="use-cases" className="py-[40px] md:py-[60px] lg:py-[100px] bg-[#fff] dark:bg-[#0F172A] relative z-20">
                <div className="my-shape-top for-use-case"></div>
                <div className="max-w-[1134px] mx-auto px-6">
                    <div className="text-center mb-[20px] md:mb-[30px] lg:mb-16">
                        <h2 className="text-[30px] md:text-[52px] dark:text-[#fff] text-[#1B1818] font-instrument font-w-thin mb-[27px] w-full max-w-[552px] m-auto leading-[52px] tracking-[-3.04px]">
                            Use <span className="highlighted-heading dark:black-heading font-instrument font-w-thin case-heading dark:text-[#82D7FF] text-[#1B1818]">cases</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {useCases.map((useCase, index) => (
                            <div key={index} className="flex flex-col items-start gap-[30px] rounded-[30px] border dark:border-white/15 border-[#0F172A] bg-white/5 overflow-hidden">
                                <div className="w-full h-full min-h-[300px] max-h-[300px]">
                                    <img src={useCase.image} className="w-[100%] h-[100%] object-cover " alt="" />
                                </div>
                                <div className="px-[20px] pb-[20px]">
                                    <div className="w-full">
                                        <a className="flex px-[15px] py-[10px] justify-center items-center gap-[10px] rounded-[1000px] border border-[#82D7FF]  backdrop-blur-[5px] 
text-[#F5EEFF] text-center font-open-sans text-[16px] dark:bg-[#1B1818] bg-[linear-gradient(85deg,#82D7FF_6.31%,#19B95A_77.97%)] font-normal leading-[24px] w-full max-w-fit mb-[30px]"> {useCase.link}</a>
                                    </div>
                                    <h3 className="dark:text-[#F5EEFF] text-[0F172A] font-open-sans text-[24px] font-bold leading-[32px]">
                                        {useCase.title}
                                    </h3>
                                    <p className="text-sm dark:text-t-secondary text-[#0F172A] leading-relaxed">
                                        {useCase.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="pb-[40px] md:pb-[60px] dark:bg-[#0F172A] bg-[#fff] px-[24px]">
                <div className="w-full max-w-[1065px] border-b dark:border-b-[#82D7FF] border-b-[#333] mx-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-[10px] md:gap-[20px] lg:gap-[40px] pb-[20px] md:pb-0">
                    <div className="w-full min-h-auto md:min-h-[60px] lg:min-h-[137px] p-[10px] bg-[#fff] dark:bg-transparent">
                        <img src="/images/shopify-logo.png" className="w-full h-full object-contain dark:invert-0 invert" alt="" />
                    </div>
                    <div className="w-full min-h-auto md:min-h-[60px] lg:min-h-[137px] p-[10px] bg-[#fff] dark:bg-transparent">
                        <img src="/images/meta.png" className="w-full h-full object-contain dark:invert-0 invert" alt="" />
                    </div>
                    <div className="w-full min-h-auto md:min-h-[60px] lg:min-h-[137px] p-[10px] bg-[#fff] dark:bg-transparent">
                        <img src="/images/salesforce.png" className="w-full h-full object-contain dark:invert-0 invert" alt="" />
                    </div>
                    <div className="w-full min-h-auto md:min-h-[60px] lg:min-h-[137px] p-[10px] bg-[#fff] dark:bg-transparent">
                        <img src="/images/acventure.png" className="w-full h-full object-contain dark:invert-0 invert" alt="" />
                    </div>
                    <div className="w-full min-h-auto md:min-h-[60px] lg:min-h-[137px] p-[10px] bg-[#fff] dark:bg-transparent">
                        <img src="/images/meta.png" className="w-full h-full object-contain dark:invert-0 invert" alt="" />
                    </div>

                </div>

            </section>

            {/* Agencies Section */}
            <section className="py-[40px] md:py-[60px] bg-[#fff] dark:bg-[#0F172A] relative">
                <div className="my-shape-top for-agencie"></div>
                <div className="max-w-[1066px] mx-auto px-6">
                    <div className="text-center mb-[30px] md:mb-16">
                        <h2 className="text-[30px] md:text-[52px] text-left dark:text-[#fff] text-[#0F172A] font-instrument font-w-thin mb-[27px] w-full  m-auto leading-[52px] tracking-[-3.04px]">
                            Agencies and <span className="highlighted-heading dark:text-[#82D7FF] text-[#0F172A] partner-heading font-instrument font-w-thin ">partners</span>
                        </h2>
                    </div>
                    <div className="w-full flex flex-col md:flex-row items-start gap-[30px] lg:gap-[120px]">
                        <div className="flex flex-col gap-[36px] w-full max-w-full md:max-w-[380px]">
                            <div className="w-full cursor-pointer" onClick={() => {setSelectedAgancyIndex(0)}}> 
                                <h3 className={`${selectedAgancyIndex === 0 ? "dark:text-[#82D7FF] text-[#0F172A]" :"dark:text-[#FDFCFB] text-[#0F172A]"} font-open-sans text-base font-normal leading-[125%]`}>
                                    Multi client delivery
                                </h3>
                                <p className={`${selectedAgancyIndex === 0 ? "dark:text-[#82D7FF] text-[#0F172A]" :"dark:text-[#FDFCFB] text-[#0F172A]"} font-open-sans text-base font-normal leading-[125%]`}>
                                    Set up separate workspaces and projects per client with clean separation
                                </p>
                            </div>
                            <div className="w-full cursor-pointer" onClick={() => {setSelectedAgancyIndex(1)}}>
                                <h3 className={`${selectedAgancyIndex === 1 ? "dark:text-[#82D7FF] text-[#82D7FF]" :"dark:text-[#FDFCFB] text-[#0F172A]"} font-open-sans text-base font-normal leading-[125%]`}>
                                    Speed to value
                                </h3>
                                <p className={`${selectedAgancyIndex === 1 ? "dark:text-[#82D7FF] text-[#0F172A]" :"dark:text-[#FDFCFB] text-[#0F172A]"} font-open-sans text-base font-normal leading-[125%]`}>
                                    Launch agents and automations in days, not months
                                </p>
                            </div>
                            <div className="w-full cursor-pointer" onClick={() => {setSelectedAgancyIndex(2)}}>
                                <h3 className={`${selectedAgancyIndex === 2 ? "dark:text-[#82D7FF] text-[#0F172A]" :"dark:text-[#FDFCFB] text-[#0F172A]"} font-open-sans text-base font-normal leading-[125%]`}>
                                    Templates and cloning
                                </h3>
                                <p className={`${selectedAgancyIndex === 2 ? "dark:text-[#82D7FF] text-[#0F172A]" :"dark:text-[#FDFCFB] text-[#0F172A]"} font-open-sans text-base font-normal leading-[125%]`}>
                                    Reuse successful flows across accounts
                                </p>
                            </div>
                            <div className="w-full cursor-pointer" onClick={() => {setSelectedAgancyIndex(3)}}>
                                <h3 className={`${selectedAgancyIndex === 3 ? "dark:text-[#82D7FF] text-[#0F172A]" :"dark:text-[#FDFCFB] text-[#0F172A]"} font-open-sans text-base font-normal leading-[125%]`}>
                                    Billing that suits your model
                                </h3>
                                <p className={`${selectedAgancyIndex === 3 ? "dark:text-[#82D7FF] text-[#0F172A]" :"dark:text-[#FDFCFB] text-[#0F172A]"} font-open-sans text-base font-normal leading-[125%]`}>
                                    Package Voicecake into your retainers or managed services
                                </p>
                            </div>
                        </div>
                        <div className="w-full h-full">
                            <img src={
                                selectedAgancyIndex === 0 ? "/images/agentimage.png"
                                : selectedAgancyIndex === 1 ? "/images/agentimage.png"
                                : selectedAgancyIndex === 2 ? "/images/agentimage.png"
                                : "/images/agentimage.png"
                            } alt="" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Table Section */}
            <section id="pricing" className="pt-[0px] md:pt-[60px] pb-[40px] md:pb-[100px] dark:bg-[#0F172A] bg-[#fff] relative">
                <div className="my-shape-top for-voice-solution"></div>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-[20px] md:mb-[50px]">
                        <h2 className="text-[30px] md:text-[52px] text-center max-w-[490px] dark:text-[#fff] text-[#0F172A] font-instrument font-w-thin mb-[27px] w-full  m-auto leading-[52px] tracking-[-3.04px]">
                            Voicecake vs point <span className="highlighted-heading dark:highlighted-heading solution-heading font-instrument font-w-thin">solutions</span>
                        </h2>
                        <p className="text-[#7483A7] text-center font-open-sans max-w-[516px] mx-auto text-base font-normal leading-5">
                            See how Voicecake compares to other solutions. We provide everything you need in one platform - no more juggling multiple tools.
                        </p>
                    </div>

                    <div className="rounded-2xl mx-auto border border-white/15 dark:bg-gray-300/14 bg-[#0F172A] backdrop-blur-sm max-w-[1120px] overflow-hidden p-[24px]">
                        <div className="overflow-x-auto">
                            <table className="w-full flex flex-col min-w-fit">
                                <thead className="w-full rounded-[65px] bg-[linear-gradient(85deg,#82D7FF_6.31%,#19B95A_77.97%)] px-[20px] py-[10px] mb-[22px] min-h-[48px] flex itme-ceneter">
                                    <tr className="w-full">
                                        <th className="text-[color:var(--Color-2,#FDFCFB)] text-left font-open-sans text-[15px] not-italic font-bold leading-[26.22px] w-[100px] min-w-[100px] max-w-[100px]">Platform</th>
                                        <th className="text-[color:var(--Color-2,#FDFCFB)] font-open-sans text-[15px] not-italic font-bold leading-[26.22px] w-[120px] min-w-[120px] max-w-[120px]">Phone Voice</th>
                                        <th className="text-[color:var(--Color-2,#FDFCFB)] font-open-sans text-[15px] not-italic font-bold leading-[26.22px] w-[100px] min-w-[100px] max-w-[100px]">Web Chat</th>
                                        <th className="text-[color:var(--Color-2,#FDFCFB)] font-open-sans text-[15px] not-italic font-bold leading-[26.22px] w-[160px] min-w-[160px] max-w-[160px]">Visual Automation</th>
                                        <th className="text-[color:var(--Color-2,#FDFCFB)] font-open-sans text-[15px] not-italic font-bold leading-[26.22px] w-[140px] min-w-[140px] max-w-[140px]">GPT Assisted</th>
                                        <th className="text-[color:var(--Color-2,#FDFCFB)] font-open-sans text-[15px] not-italic font-bold leading-[26.22px] w-[100px] min-w-[100px] max-w-[100px]">Arabic GCC</th>
                                        <th className="text-[color:var(--Color-2,#FDFCFB)] font-open-sans text-[15px] not-italic font-bold leading-[26.22px] w-[140px] min-w-[140px] max-w-[140px]">Voice Library</th>
                                        <th className="text-[color:var(--Color-2,#FDFCFB)] text-right font-open-sans text-[15px] not-italic font-bold leading-[26.22px] min-w-[150px] w-[150px] max-w-[150px]">Approach</th>
                                    </tr>
                                </thead>
                                <tbody className="w-full">
                                    {comparisonData.map((row, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-b-transparent' : ''}>
                                            <td className="px-[10px] flex py-[15px] text-left text-sm font-open-sans font-thin dark:text-t-primary text-[#fff]  border-b border-[#82D7FF]/15 w-[100px] min-w-[100px] max-w-[100px]">
                                                <StatusCheckbox value={row.platform} />
                                            </td>
                                            <td className="px-[10px] py-[15px] text-center text-sm font-open-sans font-thin dark:text-t-primary text-[#fff]  border-b border-[#82D7FF]/15 w-[120px] min-w-[120px] max-w-[120px]">
                                                <StatusCheckbox value={row.phoneVoice} />
                                            </td>
                                            <td className="px-[10px] py-[15px] text-center text-sm font-open-sans font-thin dark:text-t-primary text-[#fff]  border-b border-[#82D7FF]/15 w-[100px] min-w-[100px] max-w-[100px]">
                                                <StatusCheckbox value={row.webChat} />
                                            </td>
                                            <td className="px-[10px] py-[15px] text-center text-sm font-open-sans font-thin dark:text-t-primary text-[#fff] border-b border-[#82D7FF]/15 w-[160px] min-w-[160px] max-w-[160px]">
                                                <StatusCheckbox value={row.visualAutomation} />
                                            </td>
                                            <td className="px-[10px] py-[15px] text-center text-sm font-open-sans font-thin dark:text-t-primary text-[#fff]  border-b border-[#82D7FF]/15 w-[140px] min-w-[140px] max-w-[140px]">
                                                <StatusCheckbox value={row.gptAssisted} />
                                            </td>
                                            <td className="px-[10px] py-[15px] text-center text-sm font-open-sans font-thin dark:text-t-primary text-[#fff]  border-b border-[#82D7FF]/15 w-[140px] min-w-[140px] max-w-[140px]">
                                                <StatusCheckbox value={row.arabicGcc} />
                                            </td>
                                            <td className="px-[10px] py-[15px] text-center text-sm font-open-sans font-thin dark:text-t-primary text-[#fff]  border-b border-[#82D7FF]/15 w-[140px] min-w-[140px] max-w-[140px]">
                                                <StatusCheckbox value={row.voiceLibrary} />
                                            </td>
                                            <td className="px-[10px] py-[15px] text-sm font-open-sans font-thin dark:text-t-primary text-[#fff]  border-b border-[#82D7FF]/15 text-right w-[150px] min-w-[150px] max-w-[150px]">
                                                <StatusCheckbox value={row.approach} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-[20px] md:mt-[54px] text-center">
                        <p className="text-[16px] md:text-lg text-t-secondary max-w-4xl mx-auto">
                            Why Voicecake is better for most teams, you get the whole stack in one place, real time voice agents for calls, a website voice and chat widget, and Sim AI automations with GPT connectivity, so non technical teams can ship end to end journeys without extra tools.
                        </p>
                    </div>
                </div>
            </section>

            {/* Integrations Section */}
            <section className="py-[40px] md:py-[120px] bg-[#82D7FF]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-[20px] md:mb-16">
                        <h2 className="text-[30px] md:text-[52px] text-center text-[#0F172A] font-instrument font-w-thin mb-[27px] w-full  m-auto leading-[30px] md:leading-[52px] tracking-[-3.04px]">
                            Seamless Integrations That Power Your AI Agent
                        </h2>
                        <p className="text-[#7483A7] text-center font-open-sans text-base font-normal leading-5 w-full max-w-[703px] mx-auto">
                            Easily connect your AI agent to your tools. CRM integrations deliver smarter support without disrupting your workflow.
                        </p>
                    </div>

                    <div className="flex justify-center items-center">
                        <Image
                            src="/images/Aiimage.png"
                            width={800}
                            height={600}
                            alt="Voicecake Integrations Hub"
                            className="w-full max-w-4xl"
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="resources" className="py-[40px] md:py-[50px] lg:py-[115px] dark:bg-[#0F172A] bg-[#fff] relative z-10">
                <div className="max-w-[800px] mx-auto px-6">
                    <div className="text-center mb-[20px] md:mb-[30px] lg:mb-16">
                        <h2 className="text-[30px] md:text-[52px] text-center dark:text-[#FDFCFB] text-[#0E121B] font-instrument font-w-thin mb-[27px] w-full  m-auto leading-[52px] tracking-[-3.04px]">
                            Frequently asked <span className="dark:text-[#82D7FF] text-[#0E121B] text-[30px] md:text-[52px] not-italic font-normal leading-[100%] tracking-[-1.04px] highlighted-heading dark:highlighted-heading solution-heading font-instrument faq-heading">questions</span>
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="w-full overflow-hidden mb-[10px] md:mb-[37px]">
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full text-left flex items-center justify-between bg-transparent"
                                >
                                    <h3 className="dark:text-[#E1E3E5] text-[#0E121B] font-open-sans font-w-thin text-[18px] md:text-[20px] lg:text-[25px] leading-9">
                                        {faq.question}
                                    </h3>
                                    <img src={faq.icon} className="w-[32px] h-[32px] object-contain" />
                                </button>
                                {openFaq === index && (
                                    <div className="pr-[10px] pt-[10px] md:pr-[32px] md:pt-[20px]">
                                        <p className="dark:text-[#8b97b3] text-[#0E121B] font-open-sans text-[14px] md:text-base font-normal leading-6">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="pt-[40px] md:pt-[120px] dark:bg-[#0F172A] bg-[#fff] relative">
                <div className="my-shape-top my-shape-for-center"></div>
                <div className="max-w-[1120px] mx-auto px-6 text-center pb-[60px] border-b dark:border-b-[#FDFCFB]/15 border-b-[#2B303B]">
                    <h2 className="text-[30px] md:text-[52px] text-center dark:text-[#FDFCFB] text-[#0F172A] font-instrument font-w-thin mb-[20px] md:mb-[38px] w-full leading-[52px] tracking-[-3.04px]">
                        Let’s Get <span className="highlighted-heading dark:highlighted-heading solution-heading font-instrument started-heading">Started</span>
                    </h2>
                    <p className="dark:text-[#CACFD8] text-[#7483A7] text-center font-open-sans text-[16px] font-normal leading-[28px] tracking-[-0.32px] max-w-[680px] mb-[20px] md:mb-[56px] mx-auto">
                        Give your customers the conversational experience they deserve, global by design, Arabic when you need it, and measurable value from day one.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="flex h-9 min-w-[80px] px-3 py-[6px] justify-center items-center gap-1 rounded-full bg-gradient-to-r from-[#82D7FF] to-[#19B95A] text-[#1B1818] font-bold font-open-sans">
                            Open Dashboard
                        </button>
                    </div>
                </div>
            </section>
            <Footer/>
           
        </div >
    );
};

//export default LandingPage;
export default dynamic(() => Promise.resolve(LandingPage), {
    ssr: false,
});


const StatusCheckbox = ({ value }: any) => {
    if (value === "✓") {
        return (
            <div className="flex h-5 w-5 items-center mx-auto justify-center rounded bg-green-500">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-black"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 
              4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 
              0 001.414 0l8-8a1 1 0 000-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
        );
    }

    if (value === "✗") {
        return (
            <div className="flex h-5 w-5 items-center justify-center rounded bg-[#516066] mx-auto">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-[#FDFCFB]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 8.586l4.95-4.95a1 1 0 
               111.414 1.414L11.414 10l4.95 4.95a1 1 
               0 01-1.414 1.414L10 11.414l-4.95 4.95a1 
               1 0 01-1.414-1.414L8.586 10 3.636 5.05a1 
               1 0 011.414-1.414L10 8.586z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
        );
    }

    // fallback: just render the raw value
    return <span>{value}</span>;
};