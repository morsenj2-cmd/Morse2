import { Header } from "@/components/Header";
import { useState } from "react";
import { useBlogPosts, useCheckBlogAdmin, useCreateBlogPost, useDeleteBlogPost } from "@/lib/api";
import { Link } from "wouter";
import { SignedIn } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Calendar, User } from "lucide-react";
import { format } from "date-fns";

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

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) return;
    await createBlog.mutateAsync({ title, content, excerpt: excerpt || undefined });
    setTitle("");
    setContent("");
    setExcerpt("");
    setIsCreateOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      await deleteBlog.mutateAsync(id);
    }
  };

  return (
    <div className="bg-black w-full min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 sm:px-8 py-8 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Blog
          </h1>

          <SignedIn>
            {isAdmin && (
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Write Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#2a2a2a] border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-white">Write a Blog Post</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-gray-300 text-sm mb-1 block">Title</label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter blog title..."
                        className="bg-[#1a1a1a] border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm mb-1 block">Excerpt (optional, auto-generated if empty)</label>
                      <Textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="A short summary of the post..."
                        className="bg-[#1a1a1a] border-gray-600 text-white h-20"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm mb-1 block">Content</label>
                      <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your blog post content here..."
                        className="bg-[#1a1a1a] border-gray-600 text-white h-64"
                      />
                    </div>
                    <Button
                      onClick={handleCreate}
                      disabled={!title.trim() || !content.trim() || createBlog.isPending}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      {createBlog.isPending ? "Publishing..." : "Publish"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </SignedIn>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No blog posts yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post: any) => (
              <article key={post.id} className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 hover:border-gray-600 transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  <a className="block">
                    <h2 className="text-white text-xl sm:text-2xl font-semibold mb-2 hover:text-teal-400 transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-400 text-sm sm:text-base mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-gray-500 text-xs sm:text-sm">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {post.author?.displayName || post.author?.username || "Admin"}
                      </span>
                      {post.createdAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(post.createdAt), "MMM d, yyyy")}
                        </span>
                      )}
                    </div>
                  </a>
                </Link>
                {isAdmin && (
                  <div className="mt-4 pt-3 border-t border-gray-800">
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
