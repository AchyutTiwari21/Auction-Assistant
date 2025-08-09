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

    // Get the current favicon link or create one
    let faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      faviconLink.type = 'image/svg+xml';
      document.head.appendChild(faviconLink);
    }
    
    const originalFavicon = '/favicon.svg';

    // Function to update favicon with cache busting
    const updateFavicon = (href: string) => {
      const timestamp = new Date().getTime();
      faviconLink.href = `${href}?v=${timestamp}`;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is inactive - show Gavel icon
        updateFavicon(gavelDataUrl);
      } else {
        // Tab is active - show original favicon
        updateFavicon(originalFavicon);
      }
    };

    // Force browser to load new favicon immediately
    // Remove existing favicon links to clear cache
    const existingLinks = document.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach(link => link.remove());
    
    // Create new favicon link with the Gavel icon
    const newFaviconLink = document.createElement('link');
    newFaviconLink.rel = 'icon';
    newFaviconLink.type = 'image/svg+xml';
    newFaviconLink.href = gavelDataUrl;
    document.head.appendChild(newFaviconLink);
    
    // Update our reference
    faviconLink = newFaviconLink;

    // Listen for tab visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Restore original favicon on cleanup
      updateFavicon(originalFavicon);
    };
  }, []);
};
