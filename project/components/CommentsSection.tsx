'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { Comment } from '@/lib/creator-types';

interface CommentsSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (text: string) => Promise<void>;
}

export default function CommentsSection({ postId, comments, onAddComment }: CommentsSectionProps) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(commentText.trim());
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Comments ({comments.length})
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          placeholder="Say something nice..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="min-h-[100px] resize-none"
          disabled={isSubmitting}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !commentText.trim()}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-4 rounded-lg bg-card border border-border">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={comment.creator?.avatar}
                  alt={comment.creator?.name || 'User'}
                />
                <AvatarFallback>
                  {(comment.creator?.name || 'U').charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">
                    {comment.creator?.name || 'Anonymous'}
                  </span>
                  {comment.isSupporter && (
                    <Badge variant="secondary" className="text-xs">
                      Supporter
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
