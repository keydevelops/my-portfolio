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
        
        <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
          <section className="text-center sm:text-left font-[family-name:var(--font-geist-mono)] border-2 border-white p-6 rounded-lg">
            <h2 className="font-bold mb-4">Projects</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="border p-4 rounded bg-gray-800">
                <h3 className="font-bold">my-site</h3>
                <p>
                  <a href="https://privatekey.is-a.dev" className="text-blue-400 hover:underline">Live</a>
                  <a> | </a>
                  <a href="https://github.com/keydevelops/my-portfolio" className="text-blue-400 hover:underline">Source</a>
                </p>
              </div>
              <div className="border p-4 rounded bg-gray-800">
                <h3 className="font-bold">osu!cbmsd</h3>
                <p>
                  <a href="https://github.com/corrupted-code/osu-cbmsd/releases" className="text-blue-400 hover:underline">Builds</a>
                  <a> | </a>
                  <a href="https://github.com/corrupted-code/osu-cbmsd" className="text-blue-400 hover:underline">Source</a>
                </p>
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
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}

