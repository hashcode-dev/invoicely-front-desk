import React from 'react';

export function isEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ReactMultiEmail(props: any) {
  const { emails, onChange, placeholder, disabled } = props;

  return (
    <div className="flex flex-wrap gap-2 items-center p-2 border border-slate-200 rounded-xl">
      {emails?.map((email: string, idx: number) => (
        <span key={idx} className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm flex items-center gap-1">
          {email}
          {!disabled && (
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 ml-1"
              onClick={() => onChange(emails.filter((_: any, i: number) => i !== idx))}
            >
              ×
            </button>
          )}
        </span>
      ))}
      <input
        type="email"
        placeholder={placeholder || 'Enter email...'}
        className="flex-1 min-w-[150px] bg-transparent outline-none text-sm"
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ',') && e.currentTarget.value) {
            e.preventDefault();
            const val = e.currentTarget.value.trim();
            if (val && !emails?.includes(val)) {
              onChange([...(emails || []), val]);
              e.currentTarget.value = '';
            }
          }
        }}
      />
    </div>
  );
}
