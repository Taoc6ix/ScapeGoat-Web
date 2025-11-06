import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// ===== Types =====
type PostDetail = {
  id: number;
  title: string;
  slug: string;
  thumbnail_url: string;
  full_image_url?: string;
  external_view_url: string;
  images: Array<{
    thumbnail_url: string;
    full_image_url?: string;
    external_view_url: string;
  }>;
  size_info: string | null;
  external_link: string | null;
  categories: Array<{ name: string; slug: string }>;
  published_at: string;
};

type LatestPost = {
  id: number;
  title: string;
  slug: string;
  thumbnail_url: string;
  published_at: string;
};

// ===== API Requests =====
async function getPost(slug: string): Promise<PostDetail | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  try {
    const res = await fetch(`${apiUrl}/posts/${slug}`, { next: { revalidate: 60 } });

    if (!res.ok) return res.status === 404 ? null : null;

    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

async function getLatestPosts(): Promise<LatestPost[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  try {
    const res = await fetch(`${apiUrl}/posts?per_page=5`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" }
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

// ===== Metadata =====
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.title,
    openGraph: { images: [post.full_image_url || post.thumbnail_url] },
  };
}

// ===== Page Component =====
export default async function PostDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const post = await getPost(slug);
  const latestPosts = await getLatestPosts();

  if (!post) return notFound();

  const allImages = [
    {
      thumbnail_url: post.thumbnail_url,
      full_image_url: post.full_image_url,
      external_view_url: post.external_view_url,
    },
    ...post.images,
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold uppercase">SCAPEGOAT</h1>
            <nav className="hidden font-semibold md:flex gap-8 text-m">
              <h2><Link href="/" className="hover:text-gray-400">Home</Link></h2>
              <h2><Link href="/" className="hover:text-gray-400">Latest</Link></h2>
              <h2><Link href="/" className="hover:text-gray-400">Tags</Link></h2>
              <h2><Link href="/" className="hover:text-gray-400">Popular</Link></h2>
              <h2><Link href="/" className="hover:text-gray-400">Categories</Link></h2>
              <h2><Link href="/" className="hover:text-gray-400">Support</Link></h2>
              <h2><Link href="/" className="hover:text-gray-400">Contact Us</Link></h2>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative w-full h-[350px] md:h-[750px] overflow-hidden">
        <Image
          src={post.full_image_url || post.thumbnail_url}
          alt={post.title}
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center flex-col text-center px-4">
          <h1 className="text-xl md:text-3xl font-bold mb-4 leading-tight">{post.title}</h1>
          <h2 className="text-white font-semibold">{post.categories.map(c => c.name).join(" - ")}</h2>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-white text-xs font-bold mb-3 uppercase">FILE SIZE</h3>
              <p className="text-2xl font-bold">{post.size_info || "N/A"}</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-white text-xs font-bold mb-3 uppercase">DOWNLOAD</h3>
              {post.external_link ? (
                <a href={post.external_link} target="_blank" className="text-blue-300 hover:text-blue-300 underline font-bold">
                  DOWNLOAD LINK
                </a>
              ) : (
                <p className="text-gray-500 font-semibold">No link available</p>
              )}
            </div>
          </div>

          {allImages.map((img, i) => (
            <a key={i} href={img.external_view_url} target="_blank" className="block relative overflow-hidden rounded-lg" style={{ aspectRatio: "2/3" }}>
              <Image
                src={img.full_image_url || img.thumbnail_url}
                alt={`${post.title} - ${i + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </a>
          ))}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 sticky top-4">
          <h2 className="text-xl font-bold uppercase mb-6 pb-3 border-b border-gray-800">Latest Posts</h2>
          <div className="space-y-6">
            {latestPosts.map((p) => (
              <Link key={p.id} href={`/post/${p.slug}`} className="block group">
                <div className="relative w-full rounded-lg overflow-hidden mb-3 bg-gray-900" style={{ aspectRatio: "1/1" }}>
                  <Image src={p.thumbnail_url} alt={p.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-sm font-bold line-clamp-2 group-hover:text-gray-400">{p.title}</h3>
                <h4 className="text-xs text-gray-500 font-semibold uppercase">
                  {new Date(p.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </h4>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold uppercase mb-4">SCAPEGOAT</h3>
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
              <h4 className="text-lg font-semibold uppercase mb-4">CATEGORIES</h4>
              <ul className="space-y-2 text-sm text-gray-400">
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
            <h4>SUPPORTED BY VERENIUS</h4>
          </div>
        </div>
      </footer>
    </div>
  );
}
