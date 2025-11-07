import SmartImage from "./components/SmartImage";
import Link from "next/link";
import HeroSlider from "./components/HeroSlider";
import LoadingScreen from "./components/LoadingScreen";

type Post = {
  id: number;
  title: string;
  slug: string;
  thumbnail_url: string;
  full_image_url?: string;
  external_view_url: string;
  categories?: Array<{ name: string; slug: string }>;
  published_at?: string;
  is_popular: boolean | number | string;
  is_featured: boolean | number | string;
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
  const popularPosts = posts.filter((post) => post.is_popular === true || post.is_popular === 1);
  const featuredPosts = posts.filter(
  (post) => post.is_featured === true || post.is_featured == 1).slice(0, 3);


  return (
    <LoadingScreen>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        {featuredPosts.length > 0 && (
          <section className="relative w-full h-screen">
            <HeroSlider posts={featuredPosts} />
          </section>
        )}


        {/* Latest Posts Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-2 pb-2">
            <h2 className="text-2xl font-extrabold uppercase">LATEST POSTS</h2>
            <h3><Link href="/latest" className="text-sm hover:text-gray-400 transition-colors">
              SEE MORE →
            </Link></h3>
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
              {posts.slice(0, 9).map((post) => (
                <Link 
                  key={post.id} 
                  href={`/post/${post.slug}`}
                  className="block group"
                >
                  <div className="relative w-full rounded-lg overflow-hidden mb-3" style={{ aspectRatio: '623 / 416' }}>
                    <SmartImage
                      src={post.thumbnail_url}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="623px"
                    />
                  </div>
                  <h3>
                    <div className="mb-2">
                      {post.categories && post.categories.length > 0 ? (
                        <span className="text-sm font-bold uppercase text-gray-400">
                          {post.categories.map((c) => c.name).join(', ')}
                        </span>
                      ) : (
                        <span className="text-s uppercase text-gray-400">UNCATEGORIZED</span>
                      )}
                    </div>
                  </h3>
                  <h3 className="text-lg font-extrabold mb-2 line-clamp-2 group-hover:text-gray-400 transition-colors">
                    {post.title}
                  </h3>
                  <h3 className="text-xs font-semibold text-gray-500">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).toUpperCase()
                      : "N/A"}
                  </h3>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Popular Posts Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-2 pb-2">
            <h2 className="text-2xl font-extrabold uppercase">POPULAR POSTS</h2>
            <h3><Link href="/popular" className="text-sm hover:text-gray-400 transition-colors">
              SEE MORE →
            </Link>
            </h3>
          </div>

          {popularPosts.length === 0 ? (
            <p className="text-gray-500 text-sm">Belum ada postingan popular.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularPosts.slice(0, 9).map((post: Post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.slug}`}
                  className="block group"
                >
                  <div
                    className="relative w-full rounded-lg overflow-hidden mb-3"
                    style={{ aspectRatio: "623 / 416" }}
                  >
                    <SmartImage
                      src={post.thumbnail_url}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="623px"
                    />
                  </div>

                  <h3>
                    <div className="mb-2">
                      {post.categories && post.categories.length > 0 ? (
                        <span className="text-sm font-bold uppercase text-gray-400">
                          {post.categories.map((c) => c.name).join(', ')}
                        </span>
                      ) : (
                        <span className="text-s uppercase text-gray-400">UNCATEGORIZED</span>
                      )}
                    </div>
                  </h3>

                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-gray-400 transition-colors">
                    {post.title}
                  </h3>

                  <h3 className="text-xs font-semibold text-gray-500">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).toUpperCase()
                      : "N/A"}
                  </h3>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </LoadingScreen>
  );
}