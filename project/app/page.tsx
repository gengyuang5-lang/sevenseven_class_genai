'use client';

import { useState, useEffect } from 'react';
import PostCard from '@/components/PostCard';
import TipModal from '@/components/TipModal';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toast } from 'sonner';
import { getFeed, tipPost } from '@/lib/creator-api';
import type { Post } from '@/lib/creator-types';
import { t } from '@/lib/i18n';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'trending' | 'following' | 'latest'>('trending');
  const [typeFilter, setTypeFilter] = useState<'all' | 'video' | 'article'>('all');
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    loadPosts();
  }, [activeTab, typeFilter]);

  async function loadPosts() {
    setLoading(true);
    try {
      const result = await getFeed({
        tab: activeTab,
        type: typeFilter,
      });
      setPosts(result.items);
    } catch (error) {
      console.error('Failed to load posts:', error);
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  }

  function handleTip(postId: string) {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setTipModalOpen(true);
    }
  }

  async function confirmTip(amount: number) {
    if (!selectedPost) return;

    try {
      await tipPost(selectedPost.id, amount);

      setPosts(prev =>
        prev.map(p =>
          p.id === selectedPost.id
            ? {
                ...p,
                metrics: {
                  ...p.metrics,
                  tips: p.metrics.tips + 1,
                  tipsTotalCents: p.metrics.tipsTotalCents + amount,
                },
              }
            : p
        )
      );

      toast.success(t('tip.success'));
    } catch (error) {
      toast.error(t('tip.error'));
      throw error;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Discover</h1>
            <p className="text-muted-foreground">{t('brand.tagline')}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="bg-secondary">
                <TabsTrigger value="trending">{t('home.tabs.trending')}</TabsTrigger>
                <TabsTrigger value="following">{t('home.tabs.following')}</TabsTrigger>
                <TabsTrigger value="latest">{t('home.tabs.latest')}</TabsTrigger>
              </TabsList>
            </Tabs>

            <ToggleGroup
              type="single"
              value={typeFilter}
              onValueChange={(v) => v && setTypeFilter(v as any)}
              className="justify-start"
            >
              <ToggleGroupItem value="all" aria-label={t('filter.all')}>
                {t('filter.all')}
              </ToggleGroupItem>
              <ToggleGroupItem value="video" aria-label={t('filter.video')}>
                {t('filter.video')}
              </ToggleGroupItem>
              <ToggleGroupItem value="article" aria-label={t('filter.article')}>
                {t('filter.article')}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-xl bg-card animate-pulse overflow-hidden">
                <div className="aspect-video bg-secondary" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-secondary rounded w-3/4" />
                  <div className="h-4 bg-secondary rounded w-1/2" />
                  <div className="h-4 bg-secondary rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No posts found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onTip={handleTip}
              />
            ))}
          </div>
        )}
      </div>

      {selectedPost && (
        <TipModal
          open={tipModalOpen}
          onClose={() => setTipModalOpen(false)}
          onConfirm={confirmTip}
          articleTitle={selectedPost.title}
          authorName={selectedPost.creator?.name || ''}
          presetAmount={100}
        />
      )}
    </div>
  );
}
