'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Heart, Bookmark, Share2, X, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import ArticleCard from '@/components/ArticleCard';
import TipModal from '@/components/TipModal';
import PurchaseSheet from '@/components/PurchaseSheet';
import { toast } from 'sonner';
import { getArticleById, tipArticle, purchaseArticle, getArticles, getPaymentMethods } from '@/lib/api';
import type { Article } from '@/lib/types';

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [moreArticles, setMoreArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [purchaseSheetOpen, setPurchaseSheetOpen] = useState(false);
  const [customTipAmount, setCustomTipAmount] = useState('');
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);

  useEffect(() => {
    loadArticle();
    checkPaymentMethods();
  }, [params.id]);

  async function loadArticle() {
    try {
      const data = await getArticleById(params.id as string);
      setArticle(data);

      if (data) {
        const more = await getArticles({ category: data.category, limit: 4 });
        setMoreArticles(more.items.filter(a => a.id !== data.id).slice(0, 3));
      }
    } catch (error) {
      console.error('Failed to load article:', error);
      toast.error('Failed to load article');
    } finally {
      setLoading(false);
    }
  }

  async function checkPaymentMethods() {
    try {
      const methods = await getPaymentMethods();
      setHasPaymentMethod(methods.length > 0);
    } catch (error) {
      console.error('Failed to check payment methods:', error);
    }
  }

  async function handleTip(presetAmount?: number) {
    setTipModalOpen(true);
  }

  async function confirmTip(amount: number) {
    if (!article) return;

    try {
      const result = await tipArticle(article.id, amount);
      setArticle({ ...article, tips_count: result.newTipsCount });
      toast.success('Thanks for supporting the creator!');
    } catch (error) {
      toast.error('Tip failed. Please try again.');
      throw error;
    }
  }

  async function handlePurchase() {
    setPurchaseSheetOpen(true);
  }

  async function confirmPurchase() {
    if (!article) return;

    try {
      if (!hasPaymentMethod) {
        toast.error('Please add a payment method first');
        setTimeout(() => {
          window.location.href = '/payments';
        }, 1500);
        return;
      }

      await purchaseArticle(article.id);
      setArticle({ ...article, is_owned: true });
      toast.success('Article added to your library!');
    } catch (error) {
      toast.error('Purchase failed. Please try again.');
      throw error;
    }
  }

  function handleShare(platform: string) {
    const url = window.location.href;
    const text = article?.title || '';

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        break;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Article not found</h1>
          <p className="text-muted-foreground">The article you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const canReadContent = article.is_owned || article.price_cents === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Badge className="mb-4">{article.category}</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>

        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-12 w-12">
            <AvatarImage src={article.author.avatar_url} alt={article.author.name} />
            <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{article.author.name}</p>
            <p className="text-sm text-muted-foreground">
              {article.read_minutes} min read • {new Date(article.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <img
          src={article.thumbnail_url}
          alt={article.title}
          className="w-full aspect-video object-cover rounded-xl mb-8"
        />

        {canReadContent ? (
          <article
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: article.content_html || '' }}
          />
        ) : (
          <div className="bg-white rounded-xl p-8 mb-8 text-center border-2 border-dashed border-gray-300">
            <h2 className="text-2xl font-bold mb-4">Premium Content</h2>
            <p className="text-muted-foreground mb-6">
              Purchase this article to read the full content and support the creator.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90"
              onClick={handlePurchase}
            >
              Buy Now for ${(article.price_cents / 100).toFixed(2)}
            </Button>
          </div>
        )}

        {canReadContent && (
          <div className="bg-white rounded-xl p-6 mb-8 border">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={article.author.avatar_url} alt={article.author.name} />
                <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{article.author.name}</h3>
                <p className="text-muted-foreground mb-4">
                  Creator sharing insights on {article.category.toLowerCase()} and more.
                </p>
                <Button variant="outline" size="sm">
                  Follow
                </Button>
              </div>
            </div>
          </div>
        )}

        {moreArticles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">More from {article.author.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {moreArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onTip={(id, amount) => handleTip(amount)}
                  onPurchase={handlePurchase}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-4">
          <div className="flex-1 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => handleTip()}
            >
              <Heart className="h-4 w-4" />
              Tip ${customTipAmount || '1'}
            </Button>
            <Input
              type="number"
              step="1"
              min="1"
              placeholder="1"
              className="w-20 h-9"
              value={customTipAmount}
              onChange={(e) => setCustomTipAmount(e.target.value)}
            />
          </div>

          {canReadContent && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSaved(!saved)}
              aria-label="Save to library"
            >
              <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
            </Button>
          )}

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('twitter')}
              aria-label="Share on Twitter"
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('linkedin')}
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('copy')}
              aria-label="Copy link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <TipModal
        open={tipModalOpen}
        onClose={() => setTipModalOpen(false)}
        onConfirm={confirmTip}
        articleTitle={article.title}
        authorName={article.author.name}
        presetAmount={customTipAmount ? parseInt(customTipAmount) * 100 : undefined}
      />

      <PurchaseSheet
        open={purchaseSheetOpen}
        onClose={() => setPurchaseSheetOpen(false)}
        article={article}
        onConfirm={confirmPurchase}
        hasPaymentMethod={hasPaymentMethod}
      />
    </div>
  );
}
