import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-extrabold uppercase mb-4">SCAPEGOAT</h3>
            <h4 className="text-sm text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

            </h4>
          </div>
          <div>
            <h4 className="text-lg font-extrabold uppercase mb-4">CATEGORY</h4>
            <ul className="space-y-2 text-sm font-bold text-gray-400">
              <h4><Link href="/">JILBAB</Link></h4>
              <h4><Link href="/">KOLPRI</Link></h4>
              <h4><Link href="/">MEDIA EXC</Link></h4>
              <h4><Link href="/">OF</Link></h4>
              <h4><Link href="/">TALENT</Link></h4>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <h4>© SCAPEGOAT. ALL RIGHTS RESERVED.</h4>
          <h4>SUPPORTED BY VERENIUSS</h4>
        </div>
      </div>
    </footer>
  );
}
