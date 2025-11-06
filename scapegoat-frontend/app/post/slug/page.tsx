import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  categories: Array<{
    name: string;
    slug: string;
  }>;
  published_at: string;
};

async function getPost(slug: string): Promise<PostDetail | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  
  try {
    const res = await fetch(`${apiUrl}/posts/${slug}`, { 
      next: { revalidate: 300 } // ISR: revalidate setiap 5 menit
    });
    
    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch post');
    }
    
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.title,
    openGraph: {
      images: [post.full_image_url || post.thumbnail_url],
    },
  };
}

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  // Gabungkan thumbnail utama dengan images tambahan (max 3 total)
  const allImages = [
    { thumbnail_url: post.thumbnail_url, full_image_url: post.full_image_url, external_view_url: post.external_view_url },
    ...post.images
  ].slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold uppercase hover:text-gray-400">
              SCAPEGOAT
            </Link>
            <nav className="hidden md:flex gap-6 text-sm uppercase">
              <Link href="/" className="hover:text-gray-400">HOME</Link>
              <Link href="/" className="hover:text-gray-400">LATEST</Link>
              <Link href="/" className="hover:text-gray-400">TAGS</Link>
              <Link href="/" className="hover:text-gray-400">POPULAR</Link>
              <Link href="/" className="hover:text-gray-400">CATEGORIES</Link>
              <Link href="/" className="hover:text-gray-400">SUPPORT</Link>
              <Link href="/" className="hover:text-gray-400">CONTACT US</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <span>{post.title}</span>
        </nav>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>

        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="flex gap-2 mb-6">
            {post.categories.map((category) => (
              <span
                key={category.slug}
                className="px-3 py-1 text-xs uppercase bg-gray-800 rounded"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Images Grid (Max 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {allImages.map((img, index) => (
            <a
              key={index}
              href={img.external_view_url}
              target="_blank"
              rel="nofollow noopener"
              className="block relative w-full aspect-square rounded-lg overflow-hidden group"
            >
              <Image
                src={img.full_image_url || img.thumbnail_url}
                alt={`${post.title} - Image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </a>
          ))}
        </div>

        {/* Info & Download Section */}
        <div className="border-t border-gray-800 pt-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              {post.size_info && (
                <p className="text-sm text-gray-400">
                  <span className="font-semibold">Size:</span> {post.size_info}
                </p>
              )}
              <p className="text-sm text-gray-400">
                <span className="font-semibold">Published:</span>{" "}
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>

            {post.external_link && (
              <a
                href={post.external_link}
                target="_blank"
                rel="nofollow noopener"
                className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Download
              </a>
            )}
          </div>
        </div>

        {/* Back Button */}
        <Link
          href="/"
          className="inline-block px-6 py-3 border border-gray-800 rounded-lg hover:bg-gray-900 transition-colors"
        >
          ← Back to Home
        </Link>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold uppercase mb-4">SCAPEGOAT</h3>
              <p className="text-sm text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold uppercase mb-4">CATEGORIES</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>JILBAB</li>
                <li>KOLPRI</li>
                <li>MEDIA EXC</li>
                <li>OF</li>
                <li>TALENT</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© SCAPEGOAT. ALL RIGHTS RESERVED.</p>
            <p>SUPPORTED BY VERENIUS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}