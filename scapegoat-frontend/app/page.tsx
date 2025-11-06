import Image from "next/image";
import Link from "next/link";
import HeroSlider from "./components/HeroSlider";

type Post = {
  id: number;
  title: string;
  slug: string;
  thumbnail_url: string;
  full_image_url?: string;
  external_view_url: string;
  categories?: Array<{ name: string; slug: string }>;
  published_at?: string;
};

async function getPosts(): Promise<{ data: Post[] }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  
  try {
    console.log('Fetching from:', `${apiUrl}/posts?per_page=24`);
    
    const res = await fetch(`${apiUrl}/posts?per_page=24`, { 
      next: { revalidate: 60 },
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('Posts data received:', data);
    console.log('Posts count:', data.data?.length || 0);
    
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    return { data: [] };
  }
}

export default async function Home() {
  const { data: posts } = await getPosts();

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

      {/* Hero Section */}
      {posts.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <HeroSlider posts={posts} />
        </section>
      )}

      {/* Latest Posts Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
          <h2 className="text-xl font-bold uppercase">LATEST POSTS</h2>
          <a href="/" className="text-sm hover:text-gray-400">SEE MORE →</a>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Kok kosong min?</p>
            <p className="text-xs text-gray-600 mt-2">
              Sabar lagi maintance ya...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link 
                key={post.id} 
                href={`/post/${post.slug}`}
                className="block group"
              >
                <div className="relative w-full rounded-lg overflow-hidden mb-3" style={{ aspectRatio: '623 / 416' }}>
                  <Image
                    src={post.thumbnail_url}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="623px"
                  />
                </div>
                <div className="mb-2">
                  {post.categories && post.categories.length > 0 ? (
                    <span className="text-sm font-bold uppercase text-gray-400">
                      {post.categories.map((c) => c.name).join(', ')}
                    </span>
                  ) : (
                    <span className="text-s uppercase text-gray-400">UNCATEGORIZED</span>
                  )}
                </div>
                <h3 className="text-lg font-extrabold mb-2 line-clamp-2 group-hover:text-gray-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm font-bold text-gray-500">
                  {post.published_at 
                    ? new Date(post.published_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      }).toUpperCase()
                    : 'N/A'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Popular Posts Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
          <h2 className="text-xl font-bold uppercase">POPULAR POSTS</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <Link 
              key={post.id} 
              href={`/post/${post.slug}`}
              className="block group"
            >
              <div className="relative w-full rounded-lg overflow-hidden mb-3" style={{ aspectRatio: '623 / 416' }}>
                <Image
                  src={post.thumbnail_url}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="623px"
                />
              </div>
              <div className="mb-2">
                <span className="text-xs uppercase text-gray-400">COSPLAY</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-gray-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-xs text-gray-500">
                {post.published_at 
                  ? new Date(post.published_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    }).toUpperCase()
                  : 'N/A'}
              </p>
            </Link>
          ))}
        </div>
      </section>

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