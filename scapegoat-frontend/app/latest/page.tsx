import SmartImage from "../components/SmartImage";
import Link from "next/link";
import LoadingScreen from "../components/LoadingScreen";

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

type PaginationData = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

async function getLatestPosts(page: number = 1): Promise<{ data: Post[]; pagination: PaginationData }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  
  try {
    const res = await fetch(`${apiUrl}/posts?per_page=9&page=${page}`, { 
      next: { revalidate: 60 },
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.status}`);
    }
    
    const result = await res.json();
    return {
      data: result.data || [],
      pagination: {
        current_page: result.current_page || 1,
        last_page: result.last_page || 1,
        per_page: result.per_page || 9,
        total: result.total || 0,
      }
    };
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return { 
      data: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 9,
        total: 0,
      }
    };
  }
}

export default async function LatestPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const { data: posts, pagination } = await getLatestPosts(currentPage);

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const { current_page, last_page } = pagination;

    if (last_page <= 7) {
      for (let i = 1; i <= last_page; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (current_page > 3) {
        pages.push('...');
      }

      const start = Math.max(2, current_page - 1);
      const end = Math.min(last_page - 1, current_page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current_page < last_page - 2) {
        pages.push('...');
      }
      pages.push(last_page);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <LoadingScreen>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <section className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold uppercase text-center">
            LATEST POSTS
          </h1>
        </section>

        {/* Posts Grid */}
        <section className="container mx-auto px-4 py-8">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Kok kosong min?</p>
              <p className="text-xs text-gray-600 mt-2">
                Sabar lagi maintance ya...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
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
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="mb-2">
                      {post.categories && post.categories.length > 0 ? (
                        <span className="text-sm font-bold uppercase text-gray-400">
                          {post.categories.map((c) => c.name).join(', ')}
                        </span>
                      ) : (
                        <span className="text-sm uppercase text-gray-400">UNCATEGORIZED</span>
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

              {/* Pagination */}
              <div className="flex justify-center items-center gap-2 mt-12 mb-8">
                {/* Previous Button */}
                {pagination.current_page > 1 && (
                  <Link
                    href={`/latest?page=${pagination.current_page - 1}`}
                    className="px-4 py-2 text-sm font-semibold text-white hover:text-gray-400 transition-colors"
                  >
                    PREVIOUS
                  </Link>
                )}

                {/* Page Numbers */}
                {pageNumbers.map((pageNum, idx) => {
                  if (pageNum === '...') {
                    return (
                      <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500">
                        ...
                      </span>
                    );
                  }

                  const isActive = pageNum === pagination.current_page;
                  
                  return (
                    <Link
                      key={pageNum}
                      href={`/latest?page=${pageNum}`}
                      className={`px-4 py-2 text-sm font-semibold transition-colors ${
                        isActive 
                          ? 'text-white border-b-2 border-white' 
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}

                {/* Next Button */}
                {pagination.current_page < pagination.last_page && (
                  <Link
                    href={`/latest?page=${pagination.current_page + 1}`}
                    className="px-4 py-2 text-sm font-semibold text-white hover:text-gray-400 transition-colors"
                  >
                    NEXT
                  </Link>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </LoadingScreen>
  );
}