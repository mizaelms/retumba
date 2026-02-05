"use client"

import React from 'react';

const ALLOWED_DOMAINS = [
  'www.youtube.com',
  'youtube.com',
  'youtu.be',
  'open.spotify.com',
  'player.spotify.com',
  'soundcloud.com',
  'bandcamp.com',
  'vimeo.com',
  'player.vimeo.com'
];

interface EmbedProps {
  url: string;
  title?: string;
}

export function Embed({ url, title = "Embedded Content" }: EmbedProps) {
  let src = url;

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    const isAllowed = ALLOWED_DOMAINS.some(domain => {
        return hostname === domain || hostname.endsWith('.' + domain);
    });

    if (!isAllowed) {
        return <div className="p-4 border border-destructive/50 text-destructive bg-destructive/10 rounded-md">
            Domain not allowed for embed: {hostname}
        </div>
    }

    // Special handling for YouTube
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        const v = urlObj.searchParams.get('v');
        if (v) {
             src = `https://www.youtube.com/embed/${v}`;
        } else if (hostname === 'youtu.be') {
            src = `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
        }
    }

    // Special handling for Spotify
    if (hostname.includes('spotify.com') && !urlObj.pathname.startsWith('/embed')) {
         src = url.replace('open.spotify.com', 'open.spotify.com/embed');
    }

  } catch (e) {
      return <div className="text-destructive">Invalid URL</div>
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg aspect-video my-4 bg-muted">
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full border-0"
        loading="lazy"
      />
    </div>
  );
}
