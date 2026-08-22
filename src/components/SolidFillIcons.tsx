import React from 'react';
import { Icon, addCollection } from '@iconify/react';
import lineMdIcons from '@iconify-json/line-md/icons.json';
import lucideIcons from '@iconify-json/lucide/icons.json';
import { Brain, GraduationCap, Bot } from 'lucide-react';

// Pre-register all Iconify icon sets locally into in-memory storage.
// This guarantees 100% offline support and instantaneous SVG rendering with zero network latency.
addCollection(lineMdIcons as any);
addCollection(lucideIcons as any);

export type FillIconType = 
  | 'chat' 
  | 'knowledge' 
  | 'library' 
  | 'companyAgents'
  | 'agentStore' 
  | 'modelStore' 
  | 'dashboard' 
  | 'settings' 
  | 'tour';

type FillIconProps = {
  name: FillIconType;
  size?: number;
  className?: string;
};

/**
 * Beautiful, fully animated line-drawn glyph icons sourced directly from the Iconify plugin.
 * Leverages the premier 'line-md' animated set with 100% offline local bundles.
 */
export const FillIcon: React.FC<FillIconProps> = ({ name, size = 18, className = "" }) => {
  switch (name) {
    case 'chat':
      return (
        <span className={`inline-flex items-center justify-center ${className}`}>
          <Icon 
            icon="line-md:chat-bubble-twotone" 
            width={size} 
            height={size} 
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </span>
      );
    case 'knowledge':
      return (
        <span className={`inline-flex items-center justify-center ${className}`}>
          <Icon 
            icon="line-md:search-twotone" 
            width={size} 
            height={size} 
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </span>
      );
    case 'library':
      return (
        <span className={`inline-flex items-center justify-center ${className}`}>
          <Icon 
            icon="line-md:folder-multiple-twotone" 
            width={size} 
            height={size} 
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </span>
      );
    case 'companyAgents':
      return (
        <span className={`inline-flex items-center justify-center ${className}`}>
          <Bot 
            size={size} 
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </span>
      );

    case 'agentStore':
      return (
        <span className={`inline-flex items-center justify-center ${className}`}>
          <Icon 
            icon="line-md:grid-3-twotone" 
            width={size} 
            height={size} 
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </span>
      );
    case 'modelStore':
      return (
        <span className={`inline-flex items-center justify-center ${className}`}>
          <Brain 
            size={size} 
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </span>
      );
    case 'dashboard':
      return (
        <span className={`inline-flex items-center justify-center ${className}`}>
          <Icon 
            icon="line-md:gauge-loop" 
            width={size} 
            height={size} 
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </span>
      );
    case 'settings':
      return (
        <span className={`inline-flex items-center justify-center ${className}`}>
          <Icon 
            icon="line-md:cog-loop" 
            width={size} 
            height={size} 
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </span>
      );
    case 'tour':
      return (
        <span className={`inline-flex items-center justify-center ${className}`}>
          <GraduationCap 
            size={size} 
            className="text-sky-500 transition-transform duration-300 group-hover:scale-110"
          />
        </span>
      );
    default:
      return null;
  }
};
