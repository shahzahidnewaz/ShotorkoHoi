import { useId, useState } from "react";

function EyeIcon({ off }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {off ? (
        <>
          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 5.06-6.06M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a20.3 20.3 0 0 1-3.22 4.44" />
          <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
          <path d="M1 1l22 22" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

export function PasswordField({ id, label, value, onChange, autoComplete, required, placeholder }) {
  const [visible, setVisible] = useState(false);
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold" htmlFor={fieldId}>{label}</label>
      )}
      <div className="relative">
        <input
          id={fieldId}
          type={visible ? "text" : "password"}
          className="field pr-10 w-full"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink p-1"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          tabIndex={0}
        >
          <EyeIcon off={visible} />
        </button>
      </div>
    </div>
  );
}

export function Avatar({ name, avatarUrl, size = 40 }) {
  const initial = name?.trim()?.[0]?.toUpperCase() || "?";
  const style = { width: size, height: size, fontSize: Math.round(size * 0.42) };

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name ? `${name}'s profile photo` : "Profile photo"}
        style={style}
        className="rounded-full object-cover border border-hairline shrink-0"
      />
    );
  }

  return (
    <span
      style={style}
      className="rounded-full bg-teal text-white flex items-center justify-center font-semibold shrink-0 border border-hairline"
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

export function UnverifiedBadge() {
  return <span className="unverified-badge">Unverified &middot; Self-reported</span>;
}

export function TagChip({ children, selected }) {
  return (
    <span className={`tag-chip ${selected ? "bg-teal text-white border-teal" : ""}`}>
      {children}
    </span>
  );
}

export function EmptyState({ title, body }) {
  return (
    <div className="text-center py-14 px-5 text-ink-soft border border-dashed border-hairline-strong rounded">
      <h3 className="text-ink">{title}</h3>
      <p className="mx-auto">{body}</p>
    </div>
  );
}

export function ErrorState({ title, body }) {
  return (
    <div className="text-center py-14 px-5 text-ink-soft border border-dashed border-hairline-strong rounded">
      <h3 className="text-ink">{title}</h3>
      <p className="mx-auto">{body}</p>
    </div>
  );
}

export function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`rounded animate-pulse bg-gradient-to-r from-hairline via-[#ECE6D8] to-hairline bg-[length:400%_100%] ${className}`}
    />
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBlock key={i} className="h-20 mb-[14px]" />
      ))}
    </>
  );
}

export function Callout({ children, tone = "teal" }) {
  const toneClass = tone === "brick"
    ? "bg-brick-soft border-brick"
    : "bg-teal-soft border-teal";
  return (
    <div className={`border border-hairline border-l-4 rounded px-[18px] py-4 text-sm text-ink ${toneClass}`}>
      {children}
    </div>
  );
}
