import { Header } from "@/components/Header";
import { useBlogPost } from "@/lib/api";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { format } from "date-fns";

export const BlogDetailPage = (): JSX.Element => {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";
  const { data: post, isLoading } = useBlogPost(slug);

  return (
    <div className="bg-black w-full min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 sm:px-8 py-8 max-w-3xl mx-auto w-full">
        <Link href="/blog">
          <a className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </a>
        </Link>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full"></div>
          </div>
        ) : !post || post.message ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Blog post not found.</p>
          </div>
        ) : (
          <article>
            {post.coverImageUrl && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img src={post.coverImageUrl} alt={post.title} className="w-full h-auto object-cover max-h-96" />
              </div>
            )}

            <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-gray-500 text-sm mb-8 pb-6 border-b border-gray-800">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author?.displayName || post.author?.username || "Admin"}
              </span>
              {post.createdAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(post.createdAt), "MMMM d, yyyy")}
                </span>
              )}
            </div>

            <div className="text-gray-300 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </article>
        )}
      </main>
    </div>
  );
};
