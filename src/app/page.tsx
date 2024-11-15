"use client"
import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function Home() {
  // State to track the current quote index
  const [quoteIndex, setQuoteIndex] = useState(0);
  // Array of quotes to display
  const quotes = ["Security is just suggestion.", "Dev from russia", "I like to code in python", "I dont exploiting in lego game (maybe)"];
  // State to hold the currently displayed quote
  const [displayedQuote, setDisplayedQuote] = useState("");
  // State to determine if the quote is being deleted
  const [isDeleting, setIsDeleting] = useState(false);
  // Hook to access the router for navigation
  const router = useRouter();

  useEffect(() => {
    // Function to handle typing and deleting effect
    const handleTyping = () => {
      const currentQuote = quotes[quoteIndex];
      if (!isDeleting) {
        // Add characters to the displayed quote
        setDisplayedQuote(currentQuote.substring(0, displayedQuote.length + 1));
        // If the entire quote is displayed, start deleting after a delay
        if (displayedQuote === currentQuote) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Remove characters from the displayed quote
        setDisplayedQuote(currentQuote.substring(0, displayedQuote.length - 1));
        // If the quote is fully deleted, move to the next quote
        if (displayedQuote === "") {
          setIsDeleting(false);
          setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }
      }
    };

    // Set an interval to update the typing effect
    const typingInterval = setInterval(handleTyping, 150);
    // Clear the interval on component unmount
    return () => clearInterval(typingInterval);
  }, [displayedQuote, isDeleting, quoteIndex, quotes]);

  // Function to handle navigation to different paths
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <Head>
        <title>KeyDevS</title>
      </Head>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-900 text-white font-[family-name:var(--font-geist-sans)] overflow-hidden no-scrollbar">
        <nav className="fixed top-0 left-0 right-0 p-4 flex justify-center gap-2 bg-gray-800/80 backdrop-blur-sm">
          <button onClick={() => handleNavigation('/')} className="pl-2 hover:underline font-[family-name:var(--font-geist-mono)] text-white">Home</button>
          <button onClick={() => handleNavigation('/projects')} className="pl-2 hover:underline font-[family-name:var(--font-geist-mono)] text-white">Projects</button>
        </nav>
        
        <main className="flex flex-col gap-4 row-start-2 items-center justify-center">
          <div className="p-4 rounded-lg text-center">
            <p className="text-2xl font-bold font-[family-name:var(--font-geist-mono)]">
              Hello, <br />
              I&apos;m key.
            </p>
            <div className="border-2 border-white p-4 mt-4 rounded-lg">
              <p className="text-sm font-[family-name:var(--font-geist-mono)]">
                {displayedQuote}
              </p>
            </div>
          </div>
          
          <section className="text-center sm:text-left font-[family-name:var(--font-geist-mono)] p-6 rounded-lg">
            <h2 className="font-bold mb-4">Programming Languages I Know:</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border p-4 rounded bg-gray-800">
                <h3 className="font-bold">Python</h3>
                <p>Experience: 4 years</p>
                <p>Projects: Discord bots, Web scraping.</p>
              </div>
              <div className="border p-4 rounded bg-gray-800">
                <h3 className="font-bold">LuaU</h3>
                <p>Experience: 1 year</p>
                <p>Projects: Scripts in roblox</p>
              </div>
              <div className="border p-4 rounded bg-gray-800">
                <h3 className="font-bold">PHP</h3>
                <p>Experience: 1.5 years</p>
                <p>Projects: Websites, some apis</p>
              </div>
              <div className="border p-4 rounded bg-gray-800">
                <h3 className="font-bold">C#</h3>
                <p>Experience: 0.5 years</p>
                <p>Projects: Some apps</p>
              </div>
            </div>
          </section>
        </main>
      </div>
      <style>{`
        ::-webkit-scrollbar {
          width: 0;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </>
  );
}
