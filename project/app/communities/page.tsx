'use client';

import { useState, useEffect } from 'react';
import { Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SubscriptionSheet from '@/components/SubscriptionSheet';
import { toast } from 'sonner';
import { getCommunities, subscribeToCommunity } from '@/lib/api';
import type { Community } from '@/lib/types';

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [subscriptionSheetOpen, setSubscriptionSheetOpen] = useState(false);

  useEffect(() => {
    loadCommunities();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredCommunities(
        communities.filter(c =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredCommunities(communities);
    }
  }, [searchQuery, communities]);

  async function loadCommunities() {
    try {
      const result = await getCommunities();
      setCommunities(result.items);
      setFilteredCommunities(result.items);
    } catch (error) {
      console.error('Failed to load communities:', error);
      toast.error('Failed to load communities');
    } finally {
      setLoading(false);
    }
  }

  function handleJoin(community: Community) {
    setSelectedCommunity(community);
    setSubscriptionSheetOpen(true);
  }

  async function confirmSubscription(communityId: string, trial: boolean) {
    try {
      await subscribeToCommunity(communityId, trial);

      setCommunities(prev =>
        prev.map(c =>
          c.id === communityId
            ? { ...c, joined: true, members_count: c.members_count + 1 }
            : c
        )
      );

      toast.success(trial ? 'Free trial started!' : 'Successfully subscribed!');
    } catch (error) {
      toast.error('Subscription failed. Please try again.');
      throw error;
    }
  }

  const joinedCommunities = filteredCommunities.filter(c => c.joined);
  const recommendedCommunities = filteredCommunities.filter(c => !c.joined);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 border-b">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Exclusive Communities</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Join communities of like-minded creators and learners
          </p>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search communities..."
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <Tabs defaultValue="recommended">
          <TabsList>
            <TabsTrigger value="recommended">
              Recommended ({recommendedCommunities.length})
            </TabsTrigger>
            <TabsTrigger value="joined">
              Joined ({joinedCommunities.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommended" className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-32 bg-gray-200" />
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : recommendedCommunities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No communities found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedCommunities.map(community => (
                  <Card key={community.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={community.cover_url}
                      alt={community.name}
                      className="w-full h-32 object-cover"
                    />
                    <CardHeader>
                      <CardTitle>{community.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {community.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{community.members_count.toLocaleString()}</span>
                        </div>
                        <Badge variant="secondary">
                          ${(community.monthly_price_cents / 100).toFixed(2)}/mo
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={() => handleJoin(community)}
                      >
                        Join Community
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="joined" className="mt-6">
            {joinedCommunities.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">You haven't joined any communities yet</p>
                <Button onClick={() => document.querySelector('[value="recommended"]')?.dispatchEvent(new Event('click', { bubbles: true }))}>
                  Explore Communities
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {joinedCommunities.map(community => (
                  <Card key={community.id} className="overflow-hidden">
                    <img
                      src={community.cover_url}
                      alt={community.name}
                      className="w-full h-32 object-cover"
                    />
                    <CardHeader>
                      <CardTitle>{community.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {community.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{community.members_count.toLocaleString()}</span>
                        </div>
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                          Member
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Community
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <SubscriptionSheet
        open={subscriptionSheetOpen}
        onClose={() => setSubscriptionSheetOpen(false)}
        community={selectedCommunity}
        onConfirm={confirmSubscription}
      />
    </div>
  );
}
