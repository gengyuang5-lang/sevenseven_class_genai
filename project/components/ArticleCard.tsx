'use client';

import Link from 'next/link';
import { Heart, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Article } from '@/lib/types';

interface ArticleCardProps {
  article: Article;
  onTip: (articleId: string, amount?: number) => void;
  onPurchase: (articleId: string) => void;
}

export default function ArticleCard({ article, onTip, onPurchase }: ArticleCardProps) {
  const handleQuickTip = (e: React.MouseEvent, amount: number) => {
    e.preventDefault();
    e.stopPropagation();
    onTip(article.id, amount);
  };

  const handleTipClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTip(article.id);
  };

  const handlePurchaseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPurchase(article.id);
  };

  return (
    <div className="group rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <Link href={`/article/${article.id}`}>
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={article.thumbnail_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-3 right-3 bg-white/90 text-gray-800 backdrop-blur-sm">
            {article.category}
          </Badge>
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <Link href={`/article/${article.id}`}>
          <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Avatar className="h-6 w-6">
            <AvatarImage src={article.author.avatar_url} alt={article.author.name} />
            <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{article.author.name}</span>
          <span>•</span>
          <span>{article.read_minutes} min read</span>
        </div>

        <p className="text-sm text-gray-700 line-clamp-3">{article.excerpt}</p>

        <div className="flex items-center justify-between pt-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-1.5 hover:bg-primary hover:text-white transition-colors"
                  onClick={handleTipClick}
                  aria-label="Tip creator"
                >
                  <Heart className="h-4 w-4" />
                  <span className="text-xs font-medium">Tip</span>
                  {article.tips_count > 0 && (
                    <span className="text-xs">({article.tips_count})</span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="flex gap-1 p-1">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-7 px-2 text-xs"
                  onClick={(e) => handleQuickTip(e, 100)}
                >
                  $1
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-7 px-2 text-xs"
                  onClick={(e) => handleQuickTip(e, 300)}
                >
                  $3
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-7 px-2 text-xs"
                  onClick={(e) => handleQuickTip(e, 500)}
                >
                  $5
                </Button>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {article.is_owned ? (
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
              <Coins className="h-3 w-3 mr-1" />
              In Library
            </Badge>
          ) : article.price_cents > 0 ? (
            <Button
              size="sm"
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-full text-xs px-4"
              onClick={handlePurchaseClick}
              aria-label={`Purchase article for $${(article.price_cents / 100).toFixed(2)}`}
            >
              ${(article.price_cents / 100).toFixed(2)}
            </Button>
          ) : (
            <Badge variant="secondary" className="text-xs">
              Free
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
