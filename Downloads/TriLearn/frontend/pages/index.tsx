// pages/index.tsx
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    return (
        <>
            <Head>
                <title>TriLearn – Learn Anything in 3 Months</title>
            </Head>
            <main className="min-h-screen bg-gray-50 text-gray-800 font-sans">
                <Navbar />

                <section className="text-center px-6 py-20">
                    <h1 className="text-4xl md:text-6xl font-bold">
                        Learn Smarter. Achieve Faster.
                    </h1>
                    <p className="mt-6 text-lg text-gray-600">
                        AI-powered tools to help you study, solve, and stay on track – all in one place.
                    </p>
                    <div className="mt-8">
                        <button
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 mr-4"
                            onClick={() => {
                                router.push('/Login');
                            }}
                        >
                            Start Learning
                        </button>
                        <button className="bg-gray-200 px-6 py-3 rounded-lg text-lg hover:bg-gray-300">
                            Try a Demo
                        </button>
                    </div>
                </section>

                <section className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-2">📘 Study Guide</h2>
                        <p>Generate personalized study materials from any content.</p>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-2">📝 Practice Quizzes</h2>
                        <p>Test your knowledge with custom AI-generated quizzes.</p>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-2">📚 Flashcards</h2>
                        <p>Review topics fast with smart, spaced repetition cards.</p>
                    </div>

                </section>
            </main>
        </>
    );
}