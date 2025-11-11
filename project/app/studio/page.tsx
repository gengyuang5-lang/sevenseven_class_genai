'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Video, FileText, TrendingUp, DollarSign, Eye, Heart, X, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { uploadFile, validateFileSize, validateFileType, formatFileSize, type BucketName } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

export default function StudioPage() {
  const [uploadType, setUploadType] = useState<'video' | 'article'>('video');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [access, setAccess] = useState<'free' | 'paid'>('free');
  const videoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    }
    getUser();
  }, []);

  function handleVideoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFileType(file, 'videos')) {
      toast.error('Invalid file type. Please upload MP4, WebM, or MOV.');
      return;
    }

    if (!validateFileSize(file, 'videos')) {
      toast.error('File too large. Maximum size is 500MB.');
      return;
    }

    setVideoFile(file);
  }

  function handleCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFileType(file, 'images')) {
      toast.error('Invalid file type. Please upload JPG, PNG, or WebP.');
      return;
    }

    if (!validateFileSize(file, 'images')) {
      toast.error('File too large. Maximum size is 10MB.');
      return;
    }

    setCoverFile(file);
  }

  async function handlePublishVideo() {
    if (!videoFile || !title || !userId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      setUploadProgress(30);
      const uploadResult = await uploadFile('videos', videoFile, userId, 'posts');

      if (uploadResult.error) {
        throw new Error(uploadResult.error);
      }

      setUploadProgress(70);

      const { error } = await supabase.from('posts').insert({
        creator_id: userId,
        type: 'video',
        title,
        description,
        media_url: uploadResult.url,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        access: 'free',
      });

      if (error) throw error;

      setUploadProgress(100);
      toast.success('Video published successfully!');

      setVideoFile(null);
      setTitle('');
      setDescription('');
      setTags('');
    } catch (error: any) {
      console.error('Publish error:', error);
      toast.error(error.message || 'Failed to publish video');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  async function handlePublishArticle() {
    if (!title || !articleContent || !userId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      let finalCoverUrl = coverUrl;

      if (coverFile) {
        setUploadProgress(30);
        const uploadResult = await uploadFile('images', coverFile, userId, 'articles');

        if (uploadResult.error) {
          throw new Error(uploadResult.error);
        }

        finalCoverUrl = uploadResult.url;
      }

      setUploadProgress(70);

      const { error } = await supabase.from('posts').insert({
        creator_id: userId,
        type: 'article',
        title,
        description: articleContent.substring(0, 200),
        cover_url: finalCoverUrl,
        article_content: articleContent,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        access,
      });

      if (error) throw error;

      setUploadProgress(100);
      toast.success('Article published successfully!');

      setCoverFile(null);
      setCoverUrl('');
      setTitle('');
      setArticleContent('');
      setTags('');
      setAccess('free');
    } catch (error: any) {
      console.error('Publish error:', error);
      toast.error(error.message || 'Failed to publish article');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  const stats = [
    { label: 'Total Views', value: '24.5K', icon: Eye, change: '+12%' },
    { label: 'Total Tips', value: '$124.50', icon: DollarSign, change: '+8%' },
    { label: 'Supporters', value: '342', icon: Heart, change: '+15%' },
    { label: 'Engagement', value: '8.2%', icon: TrendingUp, change: '+3%' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Studio</h1>
          <p className="text-muted-foreground">Create, manage, and track your content</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upload">Upload Content</TabsTrigger>
            <TabsTrigger value="posts">My Posts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Create New Post</CardTitle>
                <CardDescription>
                  Share your video or article with your audience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <Button
                    variant={uploadType === 'video' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setUploadType('video')}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Video
                  </Button>
                  <Button
                    variant={uploadType === 'article' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setUploadType('article')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Article
                  </Button>
                </div>

                {uploadType === 'video' ? (
                  <div className="space-y-4">
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      className="hidden"
                      onChange={handleVideoSelect}
                    />

                    {!videoFile ? (
                      <div
                        onClick={() => videoInputRef.current?.click()}
                        className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer"
                      >
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          MP4, MOV or WebM (max 500MB)
                        </p>
                      </div>
                    ) : (
                      <div className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Video className="h-10 w-10 text-primary" />
                            <div>
                              <p className="font-medium">{videoFile.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(videoFile.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setVideoFile(null)}
                            disabled={uploading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {uploading && (
                          <div className="mt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm">Uploading... {uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        placeholder="Give your video a title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Tell viewers what your video is about"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <Input
                        placeholder="productivity, focus, tips"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tip Options</Label>
                      <p className="text-sm text-muted-foreground">
                        Viewers can tip you: $0.05 / $0.10 / $0.50 or custom amount
                      </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        className="flex-1"
                        onClick={handlePublishVideo}
                        disabled={!videoFile || !title || uploading}
                      >
                        {uploading ? 'Publishing...' : 'Publish'}
                      </Button>
                      <Button variant="outline" className="flex-1" disabled={uploading}>
                        Save Draft
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        placeholder="Give your article a title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Cover Image</Label>
                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleCoverSelect}
                      />
                      {!coverFile && !coverUrl ? (
                        <div
                          onClick={() => coverInputRef.current?.click()}
                          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                        >
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Upload cover image</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG or WebP (max 10MB)</p>
                        </div>
                      ) : (
                        <div className="border border-border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {coverFile && (
                                <img
                                  src={URL.createObjectURL(coverFile)}
                                  alt="Cover preview"
                                  className="h-12 w-12 rounded object-cover"
                                />
                              )}
                              <div>
                                <p className="font-medium">{coverFile?.name || 'Cover image'}</p>
                                {coverFile && (
                                  <p className="text-sm text-muted-foreground">
                                    {formatFileSize(coverFile.size)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCoverFile(null);
                                setCoverUrl('');
                              }}
                              disabled={uploading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Content (Markdown)</Label>
                      <Textarea
                        placeholder="Write your article in Markdown format..."
                        rows={12}
                        value={articleContent}
                        onChange={(e) => setArticleContent(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <Input
                        placeholder="creator-economy, monetization, web3"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Access</Label>
                      <div className="flex gap-2">
                        <Button
                          variant={access === 'free' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setAccess('free')}
                        >
                          Free
                        </Button>
                        <Button
                          variant={access === 'paid' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setAccess('paid')}
                        >
                          Supporters Only
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        className="flex-1"
                        onClick={handlePublishArticle}
                        disabled={!title || !articleContent || uploading}
                      >
                        {uploading ? 'Publishing...' : 'Publish'}
                      </Button>
                      <Button variant="outline" className="flex-1" disabled={uploading}>
                        Save Draft
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle>Your Posts</CardTitle>
                <CardDescription>Manage your published content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  No posts yet. Create your first post to get started!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>Track your performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-secondary">
                      <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
                      <p className="text-2xl font-bold">$124.50</p>
                      <p className="text-xs text-emerald-500 mt-1">+$12.30 this week</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary">
                      <p className="text-sm text-muted-foreground mb-1">Avg Tip</p>
                      <p className="text-2xl font-bold">$0.18</p>
                      <p className="text-xs text-muted-foreground mt-1">From 685 tips</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Detailed analytics coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Creator Settings</CardTitle>
                <CardDescription>Configure your creator preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Subscription Tiers</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                      <div>
                        <p className="font-medium">Basic Supporter</p>
                        <p className="text-sm text-muted-foreground">$3/month</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                      <div>
                        <p className="font-medium">Premium Supporter</p>
                        <p className="text-sm text-muted-foreground">$5/month</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
