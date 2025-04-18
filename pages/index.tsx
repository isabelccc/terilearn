// pages/index.tsx
import Head from 'next/head';
import { Navbar } from '../components/Navbar';
import { useRouter } from 'next/router';
import Footer from './footer';
import Login from './login';
import Link from 'next/link';

//import { Link } from 'react-scroll';
export default function Home() {
    const router = useRouter();
    return (
        <>
            <Head>
                <title>TriLearn – Learn Anything in 3 Months</title>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
            </Head>
            <main className="min-h-screen bg-gray-50 text-gray-800 font-sans">
                <Navbar />

                <section className="text-center px-6 pt-40 pb-20">
                    <h1 className="text-6xl md:text-6xl font-bold">
                        Learn Smarter, Achieve Faster.
                    </h1>

                    <p className="text-lg md:text-xl mt-4 font-medium text-gray-700">
                        AI-powered tools to help you{" "}
                        <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent font-semibold animate-gradient">
                            study
                        </span>,{" "}
                        <span className="bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text font-semibold">
                            solve
                        </span>, and{" "}
                        stay on track – all in one place.
                    </p>
                    <div className="flex justify-center gap-8 mt-8">
                        <Link href="/login" className="button2 cursor-pointer inline-block">
                            Start Learning
                        </Link>
                        
                        <a className="button1">
                            Try a Demo
                        </a>
                    </div>
                </section>

                <section className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold mb-2 text-black flex items-center gap-2">
                    <span className="material-symbols-outlined text-[24px]">
                            menu_book
                        </span> 
                        Study Guide
                        </h2>
                        <p className="text-white/90">Generate personalized study materials from any content.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-6 shadow-lg">
                         <h2 className="text-xl font-semibold mb-2 text-black flex items-center gap-2">
                        <span className="material-symbols-outlined text-[24px]">
                            quiz
                            </span>
                            Practice Quizzes</h2>
                        <p className="text-white/90">Test your knowledge with custom AI-generated quizzes.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-semibold mb-2 text-black flex items-center gap-2">
                            <span className="material-symbols-outlined text-[24px]">
                            flash_on
                            </span> Flashcards</h2>
                        <p className="text-white/90">Review topics fast with smart, spaced repetition cards.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-semibold mb-2 text-black flex items-center gap-2">
                            <span className="material-symbols-outlined text-[24px]">
                            flash_on
                            </span> Flashcards</h2>
                        <p className="text-white/90">Review topics fast with smart, spaced repetition cards.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-semibold mb-2 text-black flex items-center gap-2">
                            <span className="material-symbols-outlined text-[24px]">
                            flash_on
                            </span> Flashcards</h2>
                        <p className="text-white/90">Review topics fast with smart, spaced repetition cards.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-semibold mb-2 text-black flex items-center gap-2">
                            <span className="material-symbols-outlined text-[24px]">
                            flash_on
                            </span> Flashcards</h2>
                        <p className="text-white/90">Review topics fast with smart, spaced repetition cards.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-semibold mb-2 text-black flex items-center gap-2">
                            <span className="material-symbols-outlined text-[24px]">
                            flash_on
                            </span> Flashcards</h2>
                        <p className="text-white/90">Review topics fast with smart, spaced repetition cards.</p>
                    </div>
                    
                </section>
                <Footer />
            </main>
        </>
    );
}