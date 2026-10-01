"use client";

export default function ErrorView({
  message,
  onRetry,
  onBack,
}: {
  message: string;
  onRetry: () => void;
  onBack: () => void;
}) {
  return (
    <section className="error-box" role="alert">
      <h2>We couldn&rsquo;t finish the check</h2>
      <p className="muted">{message}</p>
      <div className="actions">
        <button className="btn btn-primary" onClick={onRetry}>Try again</button>
        <button className="btn btn-secondary" onClick={onBack}>Edit details</button>
      </div>
    </section>
  );
}
