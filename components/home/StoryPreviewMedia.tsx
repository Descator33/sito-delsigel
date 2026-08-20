"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

type StoryPreviewMediaProps = {
  src: string;
  srcVertical: string;
  videoSrc: string;
  videoSrcMobile: string;
  alt: string;
};

/**
 * Sfondo della seconda hero. Il picture resta sotto al filmato come poster e
 * fallback responsive; il video gira in loop solo quando la sezione è davvero
 * in vista, si ferma fuori schermo e non viene riprodotto con reduced motion.
 */
export function StoryPreviewMedia({
  src,
  srcVertical,
  videoSrc,
  videoSrcMobile,
  alt,
}: StoryPreviewMediaProps) {
  const figura = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [videoPronto, setVideoPronto] = useState(false);
  const riduciMovimento = useReducedMotion();

  const comuni = { alt, sizes: "100vw" } as const;
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...comuni,
    src,
    width: 1536,
    height: 1024,
  });
  const {
    props: { srcSet: mobileSrcSet, ...mobileProps },
  } = getImageProps({
    ...comuni,
    src: srcVertical,
    width: 768,
    height: 1024,
  });

  useEffect(() => {
    const elemento = video.current;
    const contenitore = figura.current;

    if (!elemento || !contenitore || riduciMovimento) {
      elemento?.pause();
      return;
    }

    let sezioneVisibile = false;
    const mostraVideo = () => setVideoPronto(true);

    if (elemento.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      mostraVideo();
    } else {
      elemento.addEventListener("loadeddata", mostraVideo, { once: true });
    }

    const sincronizzaRiproduzione = () => {
      if (sezioneVisibile && !document.hidden) {
        if (elemento.ended) elemento.currentTime = 0;
        void elemento.play().catch(() => undefined);
      } else {
        elemento.pause();
      }
    };

    const osservatore = new IntersectionObserver(
      ([voce]) => {
        sezioneVisibile = voce.isIntersecting;
        sincronizzaRiproduzione();
      },
      { threshold: 0.2 },
    );

    osservatore.observe(contenitore);
    document.addEventListener("visibilitychange", sincronizzaRiproduzione);

    return () => {
      osservatore.disconnect();
      document.removeEventListener(
        "visibilitychange",
        sincronizzaRiproduzione,
      );
      elemento.removeEventListener("loadeddata", mostraVideo);
      elemento.pause();
    };
  }, [riduciMovimento]);

  return (
    <figure
      ref={figura}
      className="absolute inset-0 z-0 overflow-hidden bg-cacao"
    >
      <div
        data-scene-story-media
        className="absolute -inset-y-[4%] inset-x-0 origin-center"
      >
        <picture className="block h-full w-full">
          <source media="(min-aspect-ratio: 5/4)" srcSet={desktopSrcSet} />
          <img
            {...mobileProps}
            alt={alt}
            srcSet={mobileSrcSet}
            className="h-full w-full object-cover object-center"
          />
        </picture>
        <video
          ref={video}
          aria-hidden="true"
          muted
          loop
          playsInline
          preload="metadata"
          data-ready={videoPronto}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-opacity duration-500 data-[ready=true]:opacity-100 motion-reduce:hidden"
        >
          <source
            media="(max-width: 767px)"
            src={videoSrcMobile}
            type="video/mp4"
          />
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
    </figure>
  );
}
