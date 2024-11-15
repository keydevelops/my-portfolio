"use client"
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function Projects() {
  // Initialize the router for navigation
  const router = useRouter();

  // Function to handle navigation to different paths
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <Head>
        {/* Set the page title */}
        <title>Projects - KeyDevS</title>
      </Head>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-900 text-white font-[family-name:var(--font-geist-sans)] overflow-hidden no-scrollbar">
        <nav className="fixed top-0 left-0 right-0 p-4 flex justify-center gap-2 bg-gray-800/80 backdrop-blur-sm">
          {/* Navigation buttons */}
          <button onClick={() => handleNavigation('/')} className="pl-2 hover:underline font-[family-name:var(--font-geist-mono)] text-white">Home</button>
          <button onClick={() => handleNavigation('/projects')} className="pl-2 hover:underline font-[family-name:var(--font-geist-mono)] text-white">Projects</button>
        </nav>
        
        {/* Main content area */}
        <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
          <section className="text-center sm:text-left font-[family-name:var(--font-geist-mono)] border-2 border-white p-6 rounded-lg">
            <h2 className="font-bold mb-4">Projects</h2>
            <div className="grid grid-cols-1 gap-4">
              {/* Placeholder for future projects */}
              <div className="border p-4 rounded bg-gray-800">
                <h3 className="font-bold">Very soon...</h3>
              </div>
            </div>
          </section>
        </main>
      </div>
      <style jsx>{`
        /* Hide scrollbar for all browsers */
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
