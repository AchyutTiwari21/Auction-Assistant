import { useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Gavel } from 'lucide-react';
import React from 'react';

export const useFavicon = () => {
  useEffect(() => {
    // Create the Gavel icon as an SVG with black background and white icon
    const gavelIconSvg = renderToStaticMarkup(
      React.createElement('svg', {
        width: 32,
        height: 32,
        viewBox: '0 0 32 32',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg'
      }, [
        React.createElement('circle', {
          key: 'bg',
          cx: 16,
          cy: 16,
          r: 16,
          fill: '#000000'
        }),
        React.createElement('g', {
          key: 'icon',
          transform: 'translate(8, 8)'
        }, React.createElement(Gavel, {
          size: 16,
          color: '#ffffff',
          strokeWidth: 2
        }))
      ])
    );
    const gavelDataUrl = `data:image/svg+xml,${encodeURIComponent(gavelIconSvg)}`;

    // Find the main favicon link (the one from index.html)
    let faviconLink = document.querySelector('link[rel="icon"][type="image/svg+xml"]') as HTMLLinkElement;
    
    // Store the original favicon URL from the HTML
    // const originalFavicon = faviconLink?.href || '/favicon.svg?v=2025';

    // Function to safely update favicon
    const updateFavicon = (href: string) => {
      if (faviconLink) {
        faviconLink.href = href;
      }
    };

    // Always use the black background with white Gavel icon
    // Set the favicon immediately on page load
    updateFavicon(gavelDataUrl);

    return () => {
      // Keep the Gavel icon even on cleanup to maintain consistency
      if (faviconLink) {
        updateFavicon(gavelDataUrl);
      }
    };
  }, []);
};
