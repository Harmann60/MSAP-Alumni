import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CLIP_START = 12;
const CLIP_END = 207; // 3:27

export default function HeroSection() {
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: 'tpEstK4dwNQ',
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          playlist: 'tpEstK4dwNQ',
          start: CLIP_START,
        },
        events: {
          onReady: (e) => {
            e.target.seekTo(CLIP_START, true);
            e.target.playVideo();
          },
          onStateChange: (e) => {
            // When video ends or buffers, check if past clip end
            if (e.data === window.YT.PlayerState.ENDED) {
              e.target.seekTo(CLIP_START, true);
              e.target.playVideo();
            }
          },
        },
      });
    };

    // Check time and loop back to start
    const interval = setInterval(() => {
      const player = playerRef.current;
      if (player && player.getCurrentTime) {
        const t = player.getCurrentTime();
        if (t >= CLIP_END) {
          player.seekTo(CLIP_START, true);
          player.playVideo();
        }
      }
    }, 500);

    return () => {
      clearInterval(interval);
      delete window.onYouTubeIframeAPIReady;
    };
  }, []);

  return (
    <div className="relative bg-ink text-parchment overflow-hidden">
      {/* YouTube background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 w-full h-full [&>iframe]:w-[100vw] [&>iframe]:h-[56.25vw] [&>iframe]:min-h-[100%] [&>iframe]:min-w-[177.78vh] [&>iframe]:absolute [&>iframe]:top-1/2 [&>iframe]:left-1/2 [&>iframe]:-translate-x-1/2 [&>iframe]:-translate-y-1/2 opacity-65" ref={containerRef} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/30" />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl animate-heroIn">
          <p className="text-vermilion text-xs font-semibold uppercase tracking-[0.2em] mb-5">
            Est. 1973 &middot; Pune, Maharashtra
          </p>

          <h1 className="font-display text-parchment text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] mb-6">
            For 50 years, Manipuri students came to Pune.
            <br />
            <span className="text-gold">This is where we stay connected.</span>
          </h1>

          <p className="text-parchment/60 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
            The Association of MSAP Alumni brings together every Manipuri who studied in Pune — from the 1973 PMSA days to today. Register to find your people.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="bg-vermilion hover:bg-vermilion-light text-parchment font-semibold px-7 py-3 transition-colors text-sm"
            >
              Register Now
            </Link>
            <Link
              to="/about"
              className="border border-parchment/20 text-parchment/80 hover:text-parchment hover:border-parchment/40 font-medium px-7 py-3 transition-colors text-sm"
            >
              Our History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
