import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(0,88,188,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(70,72,212,0.12),transparent_24%),linear-gradient(180deg,#f9f9ff_0%,#eef2ff_45%,#f9f9ff_100%)] px-4 py-10 text-ink">
      <section className="soft-card w-full max-w-lg rounded-2xl p-8 text-center shadow-panel">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white shadow-ambient">CV</div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-normal text-ink">Create your account</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Signup flow is not connected yet. Use the sign in page for now while auth is being wired up.
        </p>
        <Link className="primary-gradient mt-8 inline-flex rounded-xl px-5 py-3 text-sm font-bold text-white shadow-ambient" href="/signin">
          Back to Sign In
        </Link>
      </section>
    </main>
  );
}
