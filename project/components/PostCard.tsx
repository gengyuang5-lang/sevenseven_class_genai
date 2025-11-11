'use client';

import Link from 'next/link';
import { Play, Clock, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Post } from '@/lib/creator-types';
import { t } from '@/lib/i18n';

interface PostCardProps {
  post: Post;
  onTip?: (postId: string) => void;
}

export default function PostCard({ post, onTip }: PostCardProps) {
  const isVideo = post.type === 'video';
  const isFree = post.access === 'public';

  return (
    <div className="group rounded-xl bg-card overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      <Link href={`/post/${post.id}`}>
        <div className="relative aspect-video w-full overflow-hidden bg-secondary">
          <img
            src={post.cover}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="h-8 w-8 text-primary-foreground ml-1" fill="currentColor" />
              </div>
            </div>
          )}

          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
              {isVideo ? 'Video' : 'Article'}
            </Badge>
            <Badge
              className={isFree ? 'bg-emerald-500/90 text-white' : 'bg-accent/90 text-accent-foreground'}
            >
              {isFree ? 'Free' : 'Supporters'}
            </Badge>
          </div>

          {isVideo && post.media?.durationSeconds && (
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-xs text-white font-medium">
              {Math.floor(post.media.durationSeconds / 60)}:{String(post.media.durationSeconds % 60).padStart(2, '0')}
            </div>
          )}

          {!isVideo && post.article?.readingMins && (
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-xs text-white font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.article.readingMins} {t('post.readingTime')}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <Link href={`/post/${post.id}`}>
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>

        {post.creator && (
          <Link href={`/creator/${post.creator.handle}`} className="flex items-center gap-2 group/creator">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.creator.avatar} alt={post.creator.name} />
              <AvatarFallback>{post.creator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground group-hover/creator:text-foreground transition-colors">
              {post.creator.name}
            </span>
          </Link>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{post.metrics.views.toLocaleString()}</span>
          </div>
          {post.metrics.tips > 0 && (
            <div className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              <span>{post.metrics.tips} tips</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          {onTip && isFree && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-1.5 hover:bg-primary hover:text-primary-foreground hover:border-primary"
              onClick={(e) => {
                e.preventDefault();
                onTip(post.id);
              }}
            >
              <Heart className="h-3.5 w-3.5" />
              Tip Creator
            </Button>
          )}
          {!isFree && (
            <Button
              size="sm"
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5"
              asChild
            >
              <Link href={`/creator/${post.creator?.handle}`}>
                {t('cta.subscribe')}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
