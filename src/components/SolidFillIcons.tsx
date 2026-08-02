import React from 'react';

export type FillIconType = 
  | 'chat' 
  | 'knowledge' 
  | 'library' 
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
 * Solid Fill Icons styled for side menu navigation.
 * Uses clean SVG path fills for high contrast and brand clarity across light & dark themes.
 */
export const FillIcon: React.FC<FillIconProps> = ({ name, size = 18, className = "" }) => {
  switch (name) {
    case 'chat':
      // Solid filled chat bubble
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2C6.477 2 2 6.03 2 11c0 2.457 1.11 4.673 2.906 6.273L4 21.5a.75.75 0 001.12.656l3.868-2.148C10.027 20.33 10.99 20.5 12 20.5c5.523 0 10-4.03 10-9.5S17.523 2 12 2z" />
        </svg>
      );

    case 'knowledge':
      // Solid filled stacked database/knowledge layers
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );

    case 'library':
      // Solid filled document folder / library archive
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M4 4a2 2 0 012-2h4.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H18a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
      );

    case 'agentStore':
      // Solid filled 4-app bento grid
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <rect x="3" y="3" width="8" height="8" rx="2.5" />
          <rect x="13" y="3" width="8" height="8" rx="2.5" />
          <rect x="3" y="13" width="8" height="8" rx="2.5" />
          <rect x="13" y="13" width="8" height="8" rx="2.5" />
        </svg>
      );

    case 'modelStore':
      // Solid filled model cube / NPU block
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12.378 1.602a1.5 1.5 0 00-1.756 0L2.83 7.234A1.5 1.5 0 002 8.47v7.06a1.5 1.5 0 00.83 1.236l7.792 5.632a1.5 1.5 0 001.756 0l7.792-5.632a1.5 1.5 0 00.83-1.236V8.47a1.5 1.5 0 00-.83-1.236l-7.792-5.632zM12 11.5L4.5 6.75 12 2l7.5 4.75L12 11.5z" />
        </svg>
      );

    case 'dashboard':
      // Solid filled dashboard layout / analytics window
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M3 4a2 2 0 012-2h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4zm3 3a1 1 0 000 2h12a1 1 0 100-2H6zm0 5a1 1 0 000 2h7a1 1 0 100-2H6zm0 5a1 1 0 000 2h4a1 1 0 100-2H6z" />
        </svg>
      );

    case 'settings':
      // Solid filled gear icon
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path fillRule="evenodd" clipRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567l-.193 1.16a7.71 7.71 0 00-1.428.825l-1.096-.462c-.845-.355-1.815-.054-2.316.713l-1.157 1.776c-.501.768-.372 1.78.307 2.404l.882.812a7.653 7.653 0 000 1.65l-.882.813c-.679.624-.808 1.636-.307 2.404l1.157 1.776c.501.767 1.471 1.068 2.316.713l1.096-.462c.445.342.923.62 1.428.825l.193 1.16c.151.904.933 1.567 1.85 1.567h2.314c.917 0 1.699-.663 1.85-1.567l.193-1.16a7.708 7.708 0 001.428-.825l1.096.462c.845.355 1.815.054 2.316-.713l1.157-1.776c.501-.768.372-1.78-.307-2.404l-.882-.813a7.657 7.657 0 000-1.65l.882-.812c.679-.624.808-1.636.307-2.404l-1.157-1.776c-.501-.767-1.471-1.068-2.316-.713l-1.096.462a7.71 7.71 0 00-1.428-.825l-.193-1.16A1.868 1.868 0 0014.392 2.25h-2.314zM12 15a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      );

    case 'tour':
      // Solid filled star / sparkle
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.2L12 16.6 5.7 21.2 8 14 2 9.4h7.6L12 2z" />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
};
