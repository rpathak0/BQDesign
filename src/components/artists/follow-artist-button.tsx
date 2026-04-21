"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";

interface FollowArtistButtonProps {
  artistSlug: string;
  artistName: string;
  initialFollowers?: number;
  compact?: boolean;
  showFollowers?: boolean;
}

const STORAGE_KEY = "bq_followed_artists";

export function FollowArtistButton({
  artistSlug,
  artistName,
  initialFollowers = 14720,
  compact = false,
  showFollowers = true,
}: FollowArtistButtonProps) {
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(initialFollowers);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    const followed = raw ? (JSON.parse(raw) as string[]) : [];
    const following = followed.includes(artistSlug);
    setIsFollowing(following);
    setFollowers(following ? initialFollowers + 1 : initialFollowers);
  }, [artistSlug, initialFollowers]);

  const label = useMemo(() => (isFollowing ? "Following" : "Follow"), [isFollowing]);

  const toggleFollow = () => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    const followed = raw ? (JSON.parse(raw) as string[]) : [];

    if (followed.includes(artistSlug)) {
      const next = followed.filter((slug) => slug !== artistSlug);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setIsFollowing(false);
      setFollowers((value) => Math.max(initialFollowers, value - 1));
      toast({
        title: "Unfollowed",
        description: `You will no longer receive updates for ${artistName}.`,
      });
      return;
    }

    const next = [...followed, artistSlug];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setIsFollowing(true);
    setFollowers((value) => value + 1);
    toast({
      title: "Following",
      description: `You are now following ${artistName}.`,
    });
  };

  if (compact) {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <Button
          type="button"
          variant={isFollowing ? "secondary" : "outline"}
          className="h-10 rounded-full px-4 text-sm font-semibold"
          onClick={toggleFollow}
        >
          <Heart className={`w-4 h-4 mr-1.5 ${isFollowing ? "fill-pink-500 text-pink-500" : ""}`} />
          {label}
        </Button>
        {showFollowers && (
          <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
            <span>{followers.toLocaleString()} Following</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 sm:p-5 space-y-4">
      <Button
        type="button"
        variant="outline"
        className="w-full h-14 rounded-2xl text-xl font-semibold bg-background hover:bg-muted/60"
        onClick={toggleFollow}
      >
        <Heart className={`w-6 h-6 mr-2 ${isFollowing ? "fill-pink-500 text-pink-500" : ""}`} />
        {label}
      </Button>
      {showFollowers && (
        <div className="flex items-center gap-2 text-3xl font-display font-black tracking-tight">
          <Heart className="w-6 h-6 fill-pink-500 text-pink-500" />
          <span>{followers.toLocaleString()} Following</span>
        </div>
      )}
    </div>
  );
}
