'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Heart, Users, ExternalLink, CheckCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { getCreator, subscribeToCreator } from '@/lib/creator-api';
import type { Creator } from '@/lib/creator-types';
import { t } from '@/lib/i18n';

export default function CreatorPage() {
  const params = useParams();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);

  useEffect(() => {
    loadCreator();
  }, [params.handle]);

  async function loadCreator() {
    try {
      const data = await getCreator(params.handle as string);
      setCreator(data);
    } catch (error) {
      console.error('Failed to load creator:', error);
      toast.error('Failed to load creator profile');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubscribe(tierId: string) {
    if (!creator) return;

    setSubscribing(true);
    setSelectedTierId(tierId);

    try {
      await subscribeToCreator(creator.id, tierId);
      toast.success(t('sub.success'));
    } catch (error) {
      toast.error(t('sub.error'));
    } finally {
      setSubscribing(false);
      setSelectedTierId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Creator not found</h1>
          <p className="text-muted-foreground">The creator you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-64 overflow-hidden">
        {creator.banner && (
          <img
            src={creator.banner}
            alt={creator.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="mx-auto max-w-5xl px-4 -mt-24 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 mb-8">
          <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback className="text-4xl">{creator.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-3xl font-bold">{creator.name}</h1>
              <p className="text-muted-foreground">@{creator.handle}</p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{creator.stats.followers.toLocaleString()}</span>
                <span className="text-muted-foreground">{t('creator.followers')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{creator.stats.monthlySupporters.toLocaleString()}</span>
                <span className="text-muted-foreground">{t('creator.supporters')}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="bg-primary hover:bg-primary/90">
                {t('cta.follow')}
              </Button>
              <Button variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                {t('cta.tip')}
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="membership">Membership</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <div className="text-center py-16">
              <Play className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Posts from {creator.name} will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About {creator.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {creator.bio && (
                  <p className="text-muted-foreground leading-relaxed">{creator.bio}</p>
                )}

                {creator.links && creator.links.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Links</h3>
                    <div className="flex flex-wrap gap-2">
                      {creator.links.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="membership" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{t('sub.title')}</h2>
              <p className="text-muted-foreground">
                Support {creator.name} and get exclusive perks
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creator.tiers.filter(tier => tier.active).map((tier) => (
                <Card key={tier.id} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {tier.name}
                      <Badge variant="secondary">{tier.position === 1 ? 'Popular' : 'Pro'}</Badge>
                    </CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold text-foreground">
                        ${tier.price.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">/{t('sub.monthly')}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">{t('sub.perks')}:</p>
                      <ul className="space-y-2">
                        {tier.perks.map((perk, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => handleSubscribe(tier.id)}
                      disabled={subscribing}
                    >
                      {subscribing && selectedTierId === tier.id ? 'Processing...' : t('cta.subscribe')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {creator.tiers.filter(tier => tier.active).length === 0 && (
              <div className="text-center py-16">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {creator.name} hasn't set up membership tiers yet
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
