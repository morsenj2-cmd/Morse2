import { Header } from "@/components/Header";
import { useState } from "react";
import { useBlogPosts, useCheckBlogAdmin, useCreateBlogPost, useDeleteBlogPost } from "@/lib/api";
import { Link } from "wouter";
import { SignedIn } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Calendar, User, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const glassStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
};

const glassHoverStyle = {
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
};

export const Blog = (): JSX.Element => {
  const { data: posts = [], isLoading } = useBlogPosts();
  const { data: adminCheck } = useCheckBlogAdmin();
  const createBlog = useCreateBlogPost();
  const deleteBlog = useDeleteBlogPost();
  const isAdmin = adminCheck?.isAdmin === true;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) return;
    await createBlog.mutateAsync({ title, content, excerpt: excerpt || undefined });
    setTitle("");
    setContent("");
    setExcerpt("");
    setIsCreateOpen(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this blog post?")) {
      await deleteBlog.mutateAsync(id);
    }
  };

  return (
    <div className="bg-black w-full min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 relative px-4 sm:px-8 py-8 sm:py-12">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] relative opacity-60">
            <img
              src="/figmaAssets/spiral.png"
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-white text-4xl sm:text-5xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Blog
            </h1>

            <SignedIn>
              {isAdmin && (
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <button
                      className="text-white px-5 py-2.5 rounded-2xl text-sm font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer"
                      style={glassStyle}
                    >
                      <Plus className="w-4 h-4" />
                      Write Post
                    </button>
                  </DialogTrigger>
                  <DialogContent
                    className="text-white max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-0"
                    style={{
                      background: "rgba(20, 20, 20, 0.9)",
                      backdropFilter: "blur(40px)",
                      WebkitBackdropFilter: "blur(40px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 24px 80px rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-white text-xl">Write a Blog Post</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 mt-4">
                      <div>
                        <label className="text-white/60 text-sm mb-2 block">Title</label>
                        <Input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter blog title..."
                          className="bg-white/5 border-white/10 text-white rounded-xl focus:border-white/30 placeholder:text-white/30"
                        />
                      </div>
                      <div>
                        <label className="text-white/60 text-sm mb-2 block">Excerpt (optional)</label>
                        <Textarea
                          value={excerpt}
                          onChange={(e) => setExcerpt(e.target.value)}
                          placeholder="A short summary..."
                          className="bg-white/5 border-white/10 text-white h-20 rounded-xl focus:border-white/30 placeholder:text-white/30"
                        />
                      </div>
                      <div>
                        <label className="text-white/60 text-sm mb-2 block">Content</label>
                        <Textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Write your blog post..."
                          className="bg-white/5 border-white/10 text-white h-64 rounded-xl focus:border-white/30 placeholder:text-white/30"
                        />
                      </div>
                      <button
                        onClick={handleCreate}
                        disabled={!title.trim() || !content.trim() || createBlog.isPending}
                        className="w-full text-white py-3 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-40 hover:scale-[1.01] cursor-pointer"
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        {createBlog.isPending ? "Publishing..." : "Publish"}
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </SignedIn>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <div
                className="inline-block px-8 py-6 rounded-3xl"
                style={glassStyle}
              >
                <p className="text-white/50 text-lg">No blog posts yet.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {posts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article
                    className="rounded-2xl p-6 transition-all duration-300 cursor-pointer group"
                    style={hoveredId === post.id ? glassHoverStyle : glassStyle}
                    onMouseEnter={() => setHoveredId(post.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <h2 className="text-white text-lg sm:text-xl font-semibold mb-3 group-hover:text-white/90 transition-colors line-clamp-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-white/40 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-white/30 text-xs">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author?.displayName || post.author?.username || "Admin"}
                        </span>
                        {post.createdAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(post.createdAt), "MMM d, yyyy")}
                          </span>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-all duration-300 group-hover:translate-x-1" />
                    </div>
                    {isAdmin && (
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <button
                          onClick={(e) => handleDelete(post.id, e)}
                          className="text-red-400/60 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    )}
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
