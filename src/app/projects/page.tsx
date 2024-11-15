"use client"
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function Projects() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <Head>
        <title>Projects - KeyDevS</title>
      </Head>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-900 text-white font-[family-name:var(--font-geist-sans)] overflow-hidden no-scrollbar">
        <nav className="fixed top-0 left-0 right-0 p-4 flex justify-center gap-2 bg-gray-800/80 backdrop-blur-sm">
          <button onClick={() => handleNavigation('/')} className="pl-2 hover:underline font-[family-name:var(--font-geist-mono)] text-white">Home</button>
          <button onClick={() => handleNavigation('/projects')} className="pl-2 hover:underline font-[family-name:var(--font-geist-mono)] text-white">Projects</button>
        </nav>
        
        {/* <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
          <section className="text-center sm:text-left font-[family-name:var(--font-geist-mono)] border-2 border-white p-6 rounded-lg">
            <h2 className="font-bold mb-4">Projects</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="border p-4 rounded bg-gray-800">
                <h3 className="font-bold">Project 1</h3>
                <p>Description of project 1.</p>
              </div>
              <div className="border p-4 rounded bg-gray-800">
                <h3 className="font-bold">Project 2</h3>
                <p>Description of project 2.</p>
              </div>
              <div className="border p-4 rounded bg-gray-800">
                <h3 className="font-bold">Project 3</h3>
                <p>Description of project 3.</p>
              </div>
            </div>
            <p className="mt-4 text-sm font-[family-name:var(--font-geist-mono)]">Very soon</p>
          </section>
        </main> */}
        <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
          <section className="text-center sm:text-left font-[family-name:var(--font-geist-mono)] border-2 border-white p-6 rounded-lg">
            <h2 className="font-bold mb-4">Projects</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="border p-4 rounded bg-gray-800">
                <h3 className="font-bold">Very soon...</h3>
              </div>
            </div>
          </section>
        </main>
      </div>
      <style jsx>{`
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
