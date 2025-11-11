'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Play, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import TipModal from '@/components/TipModal';
import CommentsSection from '@/components/CommentsSection';
import { toast } from 'sonner';
import { getPost, tipPost } from '@/lib/creator-api';
import type { Post, Comment } from '@/lib/creator-types';
import { t } from '@/lib/i18n';
import { parseMarkdown } from '@/lib/markdown';

export default function PostPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    loadPost();
  }, [params.id]);

  async function loadPost() {
    try {
      const data = await getPost(params.id as string);
      setPost(data);
    } catch (error) {
      console.error('Failed to load post:', error);
      toast.error('Failed to load post');
    } finally {
      setLoading(false);
    }
  }

  async function handleTip(amount: number) {
    if (!post) return;

    try {
      await tipPost(post.id, amount);
      setPost({
        ...post,
        metrics: {
          ...post.metrics,
          tips: post.metrics.tips + 1,
          tipsTotalCents: post.metrics.tipsTotalCents + amount,
        },
      });
      toast.success(t('tip.success'));
    } catch (error) {
      toast.error(t('tip.error'));
      throw error;
    }
  }

  async function handleAddComment(text: string) {
    toast.info('Comments feature coming soon!');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Post not found</h1>
          <p className="text-muted-foreground">The post you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isVideo = post.type === 'video';

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {isVideo && post.media ? (
          <div className="mb-6">
            <video
              controls
              className="w-full aspect-video rounded-xl bg-black"
              poster={post.cover}
            >
              <source src={post.media.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="mb-6">
            <img
              src={post.cover}
              alt={post.title}
              className="w-full aspect-video object-cover rounded-xl"
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {post.creator && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.creator.avatar} alt={post.creator.name} />
                <AvatarFallback>{post.creator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{post.creator.name}</p>
                <p className="text-sm text-muted-foreground">@{post.creator.handle}</p>
              </div>
              <Button variant="outline">{t('cta.follow')}</Button>
            </div>
          )}

          {post.article && post.access === 'public' && (
            <article className="prose prose-invert max-w-none p-8 rounded-lg bg-card border border-border">
              <div dangerouslySetInnerHTML={{ __html: parseMarkdown(post.article.markdown) }} />
            </article>
          )}

          {post.access === 'supporters' && (
            <div className="p-8 text-center rounded-lg bg-card border-2 border-dashed border-border">
              <h3 className="text-xl font-semibold mb-2">{t('paywall.title')}</h3>
              <p className="text-muted-foreground mb-4">{t('paywall.subtitle')}</p>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {t('cta.subscribe')}
              </Button>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{post.metrics.views.toLocaleString()} views</span>
            <span>{post.metrics.tips} tips</span>
            <span>${(post.metrics.tipsTotalCents / 100).toFixed(2)} total</span>
          </div>

          <div className="mt-8">
            <CommentsSection
              postId={post.id}
              comments={comments}
              onAddComment={handleAddComment}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
          <Button
            className="flex-1 sm:flex-none gap-2 bg-primary hover:bg-primary/90"
            onClick={() => setTipModalOpen(true)}
          >
            <Heart className="h-4 w-4" />
            {t('cta.tip')}
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <TipModal
        open={tipModalOpen}
        onClose={() => setTipModalOpen(false)}
        onConfirm={handleTip}
        articleTitle={post.title}
        authorName={post.creator?.name || ''}
      />
    </div>
  );
}
