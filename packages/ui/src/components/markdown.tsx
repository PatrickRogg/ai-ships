'use client';

import { logger } from '@company/common/logger';
import parseHtml from 'html-react-parser';
import { useTheme } from 'next-themes';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import { bundledLanguages } from 'shiki/langs';
import { BlockMatch, LLMOutputComponent } from '../hooks/use-llm-output';
import { parseCompleteMarkdownCodeBlock } from '../hooks/use-llm-output/code';
import { useCodeBlockToHtml } from '../hooks/use-llm-output/use-code-block-to-html';
import { loadHighlighter } from '../hooks/use-llm-output/use-load-highlighter';
import { CheckIcon, CopyIcon } from '../icons';
import { Button } from './button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';

type MessageSize = 'xs' | 'sm' | 'md';

export const MarkdownComponent: LLMOutputComponent = React.memo(
  ({ blockMatch, size = 'md' }: { blockMatch: BlockMatch; size?: MessageSize }) => {
    const markdown = blockMatch.output;
    return <Markdown markdown={markdown} size={size} />;
  }
);

export const Markdown = React.memo(
  ({ markdown, size }: { markdown: string; size: MessageSize }) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: props => <H1 {...props} size={size} />,
          h2: props => <H2 {...props} size={size} />,
          h3: props => <H3 {...props} size={size} />,
          h4: props => <H4 {...props} size={size} />,
          h5: props => <H5 {...props} size={size} />,
          h6: props => <H6 {...props} size={size} />,
          p: props => <P {...props} size={size} />,
          strong: props => <Strong {...props} size={size} />,
          em: props => <Em {...props} size={size} />,
          a: props => <A {...props} size={size} />,
          ul: props => <UL {...props} size={size} />,
          ol: props => <OL {...props} size={size} />,
          li: props => <LI {...props} size={size} />,
          pre: props => <Pre {...props} size={size} />,
          blockquote: props => <Blockquote {...props} size={size} />,
          hr: props => <HR {...props} size={size} />,
          table: props => <TableComponent {...props} size={size} />,
          thead: TableHeader,
          tbody: TableBody,
          tr: TableRow,
          th: props => (
            <TableHead {...props} size={size} className="whitespace-normal break-words" />
          ),
          td: props => (
            <TableCell {...props} size={size} className="whitespace-normal break-words" />
          )
        }}
      >
        {markdown}
      </ReactMarkdown>
    );
  }
);

// Headers
export const H1 = ({
  children,
  size = 'md',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { size?: MessageSize }) => {
  const sizeClasses = {
    xs: 'text-3xl font-bold mt-6 mb-4',
    sm: 'text-4xl font-bold mt-8 mb-6',
    md: 'text-5xl font-bold mt-10 mb-8'
  };

  return (
    <h1 className={`${sizeClasses[size]} first:mt-0`} {...props}>
      {children}
    </h1>
  );
};

export const H2 = ({
  children,
  size = 'md',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { size?: MessageSize }) => {
  const sizeClasses = {
    xs: 'text-2xl font-bold mt-5 mb-3',
    sm: 'text-3xl font-bold mt-7 mb-5',
    md: 'text-4xl font-bold mt-9 mb-7'
  };

  return (
    <h2 className={`${sizeClasses[size]} first:mt-0`} {...props}>
      {children}
    </h2>
  );
};

export const H3 = ({
  children,
  size = 'md',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { size?: MessageSize }) => {
  const sizeClasses = {
    xs: 'text-xl font-bold mt-4 mb-2',
    sm: 'text-2xl font-bold mt-6 mb-4',
    md: 'text-3xl font-bold mt-8 mb-6'
  };

  return (
    <h3 className={`${sizeClasses[size]} first:mt-0`} {...props}>
      {children}
    </h3>
  );
};

export const H4 = ({
  children,
  size = 'md',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { size?: MessageSize }) => {
  const sizeClasses = {
    xs: 'text-lg font-semibold mt-3 mb-2',
    sm: 'text-xl font-semibold mt-5 mb-3',
    md: 'text-2xl font-semibold mt-7 mb-5'
  };

  return (
    <h4 className={`${sizeClasses[size]} first:mt-0`} {...props}>
      {children}
    </h4>
  );
};

export const H5 = ({
  children,
  size = 'md',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { size?: MessageSize }) => {
  const sizeClasses = {
    xs: 'text-base font-semibold mt-3 mb-1.5',
    sm: 'text-lg font-semibold mt-4 mb-2.5',
    md: 'text-xl font-semibold mt-6 mb-4'
  };

  return (
    <h5 className={`${sizeClasses[size]} first:mt-0`} {...props}>
      {children}
    </h5>
  );
};

export const H6 = ({
  children,
  size = 'md',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { size?: MessageSize }) => {
  const sizeClasses = {
    xs: 'text-sm font-semibold mt-2.5 mb-1',
    sm: 'text-base font-semibold mt-3.5 mb-2',
    md: 'text-lg font-semibold mt-5 mb-3'
  };

  return (
    <h6 className={`${sizeClasses[size]} first:mt-0`} {...props}>
      {children}
    </h6>
  );
};

// Text
export const P = ({
  children,
  size = 'md',
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { size?: MessageSize }) => {
  const sizeClasses = {
    xs: 'leading-5 [&:not(:first-child)]:mt-2 mb-1 text-xs',
    sm: 'leading-6 [&:not(:first-child)]:mt-3 mb-2 text-sm',
    md: 'leading-7 [&:not(:first-child)]:mt-4 mb-3'
  };

  return (
    <p className={sizeClasses[size]} {...props}>
      {children}
    </p>
  );
};

export const Strong = ({
  children,
  size = 'md',
  ...props
}: React.HTMLAttributes<HTMLElement> & { size?: MessageSize }) => (
  <strong className="font-bold" {...props}>
    {children}
  </strong>
);

export const Em = ({
  children,
  size = 'md',
  ...props
}: React.HTMLAttributes<HTMLElement> & { size?: MessageSize }) => (
  <em className="italic" {...props}>
    {children}
  </em>
);

const highlighter = loadHighlighter(
  createHighlighterCore({
    themes: [import('shiki/themes/github-dark.mjs'), import('shiki/themes/github-light.mjs')],
    langs: Object.values(bundledLanguages),
    engine: createJavaScriptRegexEngine()
  })
);

export const Code: LLMOutputComponent = ({ blockMatch, size }): React.JSX.Element => {
  const { resolvedTheme } = useTheme();

  // Extract language from the code block
  const { language, code: rawCode } = parseCompleteMarkdownCodeBlock(blockMatch.output);
  const displayLanguage = language || 'text';

  // Copy functionality
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode || '');
    } catch (error) {
      logger.error('Failed to copy code:', error);
    }
  };

  // Get theme-specific background colors to match shiki
  const themeColors = {
    'github-dark': {
      background: 'rgb(36, 41, 46)',
      textColor: 'rgb(225, 228, 232)'
    },
    'github-light': {
      background: '#ffffff',
      textColor: '#656d76'
    }
  };

  const currentTheme = resolvedTheme === 'dark' ? 'github-dark' : 'github-light';
  const { background, textColor } = themeColors[currentTheme];

  // Define styling classes based on size
  const styleClasses = {
    xs: {
      container: 'mb-3 mt-4 rounded-lg',
      topBar: 'flex items-center justify-between px-3 py-1.5',
      language: 'text-xs font-medium',
      pre: 'p-3 pt-1.5 rounded-none rounded-b-lg m-0 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600',
      code: 'text-xs',
      button: 'h-6'
    },
    sm: {
      container: 'mb-4 mt-6 rounded-lg',
      topBar: 'flex items-center justify-between px-4 py-2',
      language: 'text-sm font-medium',
      pre: 'p-4 pt-2 rounded-none rounded-b-lg m-0 overflow-x-auto',
      code: 'text-xs',
      button: 'h-7'
    },
    md: {
      container: 'mb-6 mt-8 rounded-lg',
      topBar: 'flex items-center justify-between px-4 py-2.5',
      language: 'text-sm font-medium',
      pre: 'p-4 pt-2 rounded-none rounded-b-lg m-0 overflow-x-auto',
      code: 'text-sm',
      button: 'h-8'
    }
  };

  const { html, code } = useCodeBlockToHtml({
    markdownCodeBlock: blockMatch.output,
    highlighter,
    codeToHtmlOptions: {
      theme: resolvedTheme === 'dark' ? 'github-dark' : 'github-light',
      transformers: [
        {
          pre(node) {
            // Add Tailwind classes to the pre element, removing top radius
            this.addClassToHast(node, styleClasses[size].pre);
          },
          code(node) {
            this.addClassToHast(node, styleClasses[size].code);
          }
        }
      ]
    }
  });

  if (!html) {
    return (
      <div
        className={styleClasses[size].container}
        style={{ backgroundColor: background, color: textColor }}
      >
        {/* Top bar */}
        <div className={styleClasses[size].topBar}>
          <span className={styleClasses[size].language}>{displayLanguage}</span>
          <Button
            variant="ghost"
            size="xs"
            onClick={handleCopy}
            className={`${styleClasses[size].button} px-2`}
            title="Copy code"
          >
            <CopyIcon className="h-3 w-3" />
          </Button>
        </div>
        {/* Code content */}
        <pre
          className={`shiki ${styleClasses[size].pre}`}
          style={{ backgroundColor: background, color: textColor }}
        >
          <code className={styleClasses[size].code}>{code}</code>
        </pre>
      </div>
    );
  }

  // For syntax highlighted content, we need to wrap it in our container
  const htmlWithTopBar = (
    <div
      className={styleClasses[size].container}
      style={{ backgroundColor: background, color: textColor }}
    >
      {/* Top bar */}
      <div className={styleClasses[size].topBar}>
        <span className={styleClasses[size].language}>{displayLanguage}</span>
        <CopyButton handleCopy={handleCopy} size={size} />
      </div>
      {/* Code content */}
      {parseHtml(html)}
    </div>
  );

  return htmlWithTopBar;
};

const CopyButton = ({
  handleCopy,
  size
}: {
  handleCopy: () => Promise<void>;
  size: MessageSize;
}) => {
  const [isCopied, setIsCopied] = React.useState(false);

  const styleClasses = {
    xs: 'h-6',
    sm: 'h-7',
    md: 'h-8'
  };

  const handleCopyClick = async () => {
    await handleCopy();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={handleCopyClick}
      className={`${styleClasses[size]} px-2`}
    >
      {isCopied ? <CheckIcon className="h-3 w-3" /> : <CopyIcon className="h-3 w-3" />}
    </Button>
  );
};

// Links
export const A = ({
  children,
  href,
  size = 'md',
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { size?: MessageSize }) => (
  <a
    href={href}
    className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
    {...props}
  >
    {children}
  </a>
);

// Lists
export const UL = ({
  children,
  size = 'md',
  ...props
}: React.HTMLAttributes<HTMLUListElement> & { size?: MessageSize }) => {
  const sizeClasses = {
    xs: 'ml-4 list-disc [&>li]:mt-1',
    sm: 'ml-5 list-disc [&>li]:mt-2',
    md: 'ml-6 list-disc [&>li]:mt-3'
  };

  return (
    <ul className={sizeClasses[size]} {...props}>
      {children}
    </ul>
  );
};

export const OL = ({
  children,
  size = 'md',
  ...props
}: React.HTMLAttributes<HTMLOListElement> & { size?: MessageSize }) => {
  const sizeClasses = {
    xs: 'ml-4 list-decimal [&>li]:mt-1.5',
    sm: 'ml-5 list-decimal [&>li]:mt-2.5',
    md: 'ml-6 list-decimal [&>li]:mt-3'
  };

  return (
    <ol className={sizeClasses[size]} {...props}>
      {children}
    </ol>
  );
};

export const LI = ({
  children,
  size = 'md',
  ...props
}: React.HTMLAttributes<HTMLLIElement> & { size?: MessageSize }) => {
  const sizeClasses = {
    xs: 'my-2 text-xs',
    sm: 'my-2 text-sm',
    md: 'my-2'
  };
  return (
    <li className={sizeClasses[size]} {...props}>
      {children}
    </li>
  );
};

// Code blocks
export const Pre = ({
  children,
  size = 'md',
  ...props
}: React.HTMLAttributes<HTMLPreElement> & { size?: MessageSize }) => {
  const sizeClasses = {
    xs: 'mb-3 mt-4 overflow-x-auto rounded-lg border bg-muted p-2 text-xs max-w-full break-words scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600',
    sm: 'mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted p-3 text-sm max-w-full break-words',
    md: 'mb-6 mt-8 overflow-x-auto rounded-lg border bg-muted p-4 max-w-full break-words'
  };

  return (
    <pre className={sizeClasses[size]} {...props}>
      <code className="block overflow-x-auto break-words whitespace-pre-wrap">{children}</code>
    </pre>
  );
};

// Block elements
export const Blockquote = ({
  children,
  size = 'md',
  ...props
}: React.HTMLAttributes<HTMLQuoteElement> & { size?: MessageSize }) => {
  const sizeClasses = {
    xs: 'mt-4 border-l-2 pl-3 italic text-xs',
    sm: 'mt-6 border-l-2 pl-4 italic text-sm',
    md: 'mt-8 border-l-2 pl-6 italic'
  };

  return (
    <blockquote className={sizeClasses[size]} {...props}>
      {children}
    </blockquote>
  );
};

export const HR = ({
  size = 'md',
  ...props
}: React.HTMLAttributes<HTMLHRElement> & { size?: MessageSize }) => {
  const sizeClasses = {
    xs: 'my-3 border-t',
    sm: 'my-4 border-t',
    md: 'my-6 border-t'
  };

  return <hr className={sizeClasses[size]} {...props} />;
};

// Table wrapper to use shadcn Table component
export const TableComponent = ({
  children,
  size = 'md',
  ...props
}: React.TableHTMLAttributes<HTMLTableElement> & { size?: MessageSize }) => {
  const sizeClasses = {
    xs: 'my-4 w-full max-w-full overflow-x-auto text-xs',
    sm: 'my-6 w-full max-w-full overflow-x-auto text-sm',
    md: 'my-8 w-full max-w-full overflow-x-auto'
  };

  return (
    <div className={sizeClasses[size]}>
      <Table {...props} className="w-full table-fixed">
        {children}
      </Table>
    </div>
  );
};
