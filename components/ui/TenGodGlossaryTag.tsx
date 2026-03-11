'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { TenGodName } from '@/types/bazi';
import { TEN_GOD_GLOSSARY } from '@/data/tenGodGlossary';

interface TenGodGlossaryTagProps {
  tenGod: TenGodName;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export default function TenGodGlossaryTag({
  tenGod,
  className = '',
  style,
  children,
}: TenGodGlossaryTagProps) {
  const [open, setOpen] = useState(false);
  const item = useMemo(() => TEN_GOD_GLOSSARY[tenGod], [tenGod]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={`ten-god-glossary-trigger ${className}`.trim()}
        style={style}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`查看${tenGod}說明`}
      >
        {children ?? tenGod}
      </button>

      {open ? (
        <div
          className="ten-god-glossary-overlay"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className="ten-god-glossary-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${tenGod}說明`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="ten-god-glossary-modal-head">
              <div>
                <div className="ten-god-glossary-kicker">十神說明</div>
                <h3 className="ten-god-glossary-title">{item.name}</h3>
              </div>

              <button
                type="button"
                className="ten-god-glossary-close"
                onClick={() => setOpen(false)}
                aria-label="關閉說明"
              >
                ×
              </button>
            </div>

            <div className="ten-god-glossary-summary">{item.short}</div>

            <div className="ten-god-glossary-keywords">
              {item.keywords.map((keyword) => (
                <span key={keyword} className="ten-god-glossary-keyword">
                  {keyword}
                </span>
              ))}
            </div>

            <div className="ten-god-glossary-sections">
              <div className="ten-god-glossary-section">
                <div className="ten-god-glossary-label">基本意思</div>
                <p>{item.description}</p>
              </div>

              <div className="ten-god-glossary-section">
                <div className="ten-god-glossary-label">常見表現</div>
                <p>{item.strengths}</p>
              </div>

              <div className="ten-god-glossary-section">
                <div className="ten-god-glossary-label">失衡提醒</div>
                <p>{item.caution}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}