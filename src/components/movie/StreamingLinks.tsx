
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface StreamingProvider {
  name: string;
  logo: string;
  url: string;
}

interface StreamingLinksProps {
  providers: StreamingProvider[];
}

const StreamingLinks = ({ providers }: StreamingLinksProps) => {
  if (providers.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 border border-white/5 rounded-lg bg-movie-dark">
        <p className="text-sm text-white/60">No streaming links available</p>
      </div>
    );
  }

  return (
    <div className="border border-white/5 rounded-lg bg-movie-dark p-4">
      <h3 className="text-sm font-medium mb-3">Watch On</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {providers.map((provider) => (
          <a 
            key={provider.name}
            href={provider.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-movie-darker border border-white/10 rounded-lg p-2 transition-colors hover:border-movie-primary/50"
          >
            <img 
              src={provider.logo} 
              alt={provider.name} 
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs font-medium">{provider.name}</span>
            <ExternalLink size={12} className="ml-auto text-white/60" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default StreamingLinks;
