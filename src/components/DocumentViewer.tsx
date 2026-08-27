import React, { useState } from 'react';
import { GeneratedDocument, useAppContext } from '../store/AppContext';
import { Eye, Copy, Check, X, Maximize2, Minimize2, Download, FileText, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface DocumentViewerProps {
  document: GeneratedDocument;
  onClose: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document: doc,
  onClose,
  isExpanded = false,
  onToggleExpand,
}) => {
  const { showToast } = useAppContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(doc.content);
    setCopied(true);
    showToast('Document copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([doc.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    const filename = `${doc.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${doc.type.toLowerCase()}`;
    link.download = filename;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  };

  // Helper to render basic Markdown elements gracefully
  const renderFormattedMarkdown = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockBuffer: string[] = [];

    lines.forEach((line, idx) => {
      // Code block start/end
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false;
          elements.push(
            <div key={`code-${idx}`} className="my-3 relative group">
              <pre className="bg-[#121418] border border-white/10 p-4 rounded-xl font-martian text-xs text-zinc-300 overflow-x-auto leading-relaxed">
                {codeBlockBuffer.join('\n')}
              </pre>
            </div>
          );
          codeBlockBuffer = [];
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockBuffer.push(line);
        return;
      }

      // Horizontal Rule
      if (line.trim() === '---' || line.trim() === '***') {
        elements.push(<hr key={`hr-${idx}`} className="border-white/10 my-5" />);
        return;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${idx}`} className="font-bricolage text-xl sm:text-2xl font-bold tracking-tight text-white mt-5 mb-3 border-b border-white/10 pb-2">
            {line.replace('# ', '')}
          </h1>
        );
        return;
      }

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${idx}`} className="font-bricolage text-lg sm:text-xl font-semibold text-white/95 mt-4 mb-2">
            {line.replace('## ', '')}
          </h2>
        );
        return;
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${idx}`} className="font-martian text-xs font-bold uppercase tracking-wider text-zinc-400 mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
        return;
      }

      // Bullet lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.trim().replace(/^[-*]\s+/, '');
        elements.push(
          <div key={`bullet-${idx}`} className="flex items-start gap-2.5 my-1.5 pl-2 text-white/85 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 flex-shrink-0" />
            <span className="font-familjen leading-relaxed">{parseInlineStyles(itemText)}</span>
          </div>
        );
        return;
      }

      // Numbered lists
      if (/^\d+\.\s/.test(line.trim())) {
        const match = line.trim().match(/^(\d+)\.\s+(.*)/);
        if (match) {
          elements.push(
            <div key={`num-${idx}`} className="flex items-start gap-2.5 my-1.5 pl-1 text-white/85 text-sm">
              <span className="font-martian text-xs font-bold text-zinc-400 min-w-[18px]">{match[1]}.</span>
              <span className="font-familjen leading-relaxed">{parseInlineStyles(match[2])}</span>
            </div>
          );
          return;
        }
      }

      // Empty lines
      if (!line.trim()) {
        elements.push(<div key={`space-${idx}`} className="h-2" />);
        return;
      }

      // Paragraph
      elements.push(
        <p key={`p-${idx}`} className="font-familjen text-sm text-white/80 leading-relaxed my-1.5">
          {parseInlineStyles(line)}
        </p>
      );
    });

    return elements;
  };

  // Helper to parse **bold**, *italics*, and `code` inline
  const parseInlineStyles = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-white/90">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="font-martian text-[11px] bg-white/10 text-zinc-300 px-1.5 py-0.5 rounded border border-white/5">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`bg-[#181B20] text-white border-l border-white/10 flex flex-col h-full overflow-hidden shadow-2xl relative ${
        isExpanded ? 'fixed inset-0 z-50 w-full h-full' : 'w-full md:w-[480px] lg:w-[580px] xl:w-[640px] flex-shrink-0'
      }`}
    >
      {/* Header Bar */}
      <div className="bg-[#121418] border-b border-white/10 px-4 py-3 flex items-center justify-between flex-shrink-0 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-zinc-500/15 border border-zinc-500/30 flex items-center justify-center text-zinc-300 flex-shrink-0">
            <Eye size={15} />
          </div>
          <div className="min-w-0 flex items-center gap-2">
            <h3 className="font-bricolage text-sm font-semibold text-white truncate">
              {doc.title}
            </h3>
            <span className="font-martian text-[10px] text-white/50 px-1.5 py-0.5 rounded bg-white/10 border border-white/10 flex-shrink-0 font-medium">
              {doc.type}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="p-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-martian border border-white/5"
            title="Copy document content"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span className="text-[11px] hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors border border-white/5"
            title="Download document file"
          >
            <Download size={15} />
          </button>

          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors border border-white/5"
              title={isExpanded ? 'Collapse side panel' : 'Maximize viewer'}
            >
              {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/80 text-white/80 hover:text-white transition-colors"
            title="Close document viewer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Main Document Content Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-2 selection:bg-zinc-700/30 selection:text-white">
        <div className="max-w-3xl mx-auto">
          {renderFormattedMarkdown(doc.content)}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-[#121418] border-t border-white/10 px-4 py-2 flex items-center justify-between text-[11px] font-martian text-white/40 flex-shrink-0">
        <div className="flex items-center gap-2">
          <FileText size={13} className="text-zinc-400/80" />
          <span>Camry On-Premise Generated Document</span>
        </div>
        <span>{doc.content.split(/\s+/).length} words</span>
      </div>
    </motion.div>
  );
};
