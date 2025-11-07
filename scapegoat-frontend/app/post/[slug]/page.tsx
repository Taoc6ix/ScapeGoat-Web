import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import LoadingScreen from "@/app/components/LoadingScreen";

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
    <LoadingScreen>
      <div className="min-h-screen bg-black text-white">
        {/* Hero */}
        <section className="relative w-full h-[350px] md:h-[750px] overflow-hidden">
          <Image
            src={post.full_image_url || post.thumbnail_url}
            alt={post.title}
            fill
            sizes="100vw"
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center flex-col text-center px-4">
            <h1 className="text-xl md:text-3xl font-bold mb-4 leading-tight">{post.title}</h1>
            <h2 className="text-gray-300 font-semibold text-sm md:text-base">
              {post.categories.map(c => c.name).join(" - ")}
            </h2>
          </div>
        </section>

        {/* Content */}
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            <div className="gap-4 justify-center">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 max-w-xs mx-auto text-center">
                <h3 className="text-s font-bold mb-3 uppercase text-white">FILE SIZE</h3>
                <h4 className="text-xl mb-3 text-gray-200 font-bold">{post.size_info || "Gatau sizenya"}</h4>
              </div>
            </div>
            
            <h2 className="text-xs font-bold text-center uppercase text-white">SCROLL KEBAWAH BIAR DAPAT LINK</h2>

            <div className="grid grid-cols-1 gap-4">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-center uppercase text-white">PREVIEW</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allImages.map((img, i) => (
                <a
                  key={i}
                  href={img.external_view_url}
                  target="_blank"
                  className="block relative overflow-hidden rounded-lg"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <Image
                    src={img.full_image_url || img.thumbnail_url}
                    alt={`${post.title} - ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw,   (max-width: 1024px) 33vw, 25vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </a>
              ))}
            </div>

            <div className="justify-center text-center bg-gray-900 rounded-lg p-6 border border-gray-800 max-w-lg mx-auto gap-4">
                {post.external_link ? (
                  <h3>
                    <a href={post.external_link} target="_blank" className="text-blue-400 hover:text-blue-500 underline font-bold">
                    DOWNLOAD TANPA SHORTLINK
                    </a>
                  </h3>
                ) : (
                  <p className="text-gray-500 font-semibold">No link available</p>
                )}
              </div>
          </div>  

          {/* Sidebar */}
          <div className="lg:col-span-1 sticky top-4">
            <h2 className="text-xl font-bold uppercase mb-2 pb-3">Latest Posts</h2>
            <div className="space-y-6">
              {latestPosts.map((p) => (
                <Link key={p.id} href={`/post/${p.slug}`} className="block group">
                  <div className="relative w-full rounded-lg overflow-hidden mb-3 bg-gray-900" style={{ aspectRatio: "16/10" }}>
                    <Image
                      src={p.thumbnail_url}
                      alt={p.title}
                      fill
                      sizes="100vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
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
      </div>
    </LoadingScreen>
  );
}