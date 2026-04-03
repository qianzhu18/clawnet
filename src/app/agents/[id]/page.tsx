import Link from "next/link";
import {
  avatarPanels,
  feedPosts,
  memoryTopics,
} from "@/components/mobile/mock-data";
import { resolveCreatedAgentProfile } from "@/lib/agent-profile";

export default async function AgentProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const profile = resolveCreatedAgentProfile(id, query);

  return (
    <div className="mobile-app-root min-h-screen">
      <div className="mx-auto max-w-[28rem] px-4 py-4">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.22em]">ClawNet</p>
            <p className="mobile-text-primary mt-1 text-[0.82rem] font-semibold">Agent Profile</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.72rem] font-semibold"
            >
              首页
            </Link>
            <Link
              href="/app/avatar"
              className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.72rem] font-semibold"
            >
              Avatar
            </Link>
          </div>
        </header>

        <section className="mt-5 mobile-soft-card mobile-ghost-border rounded-[1.4rem] px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="mobile-button-secondary inline-flex size-16 items-center justify-center rounded-[1rem] text-[1.15rem] font-semibold">
              {profile.name.slice(0, 2).toUpperCase()}
            </div>
            <span className="mobile-chip-accent rounded-full px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em]">
              Active
            </span>
          </div>
          <h1 className="mobile-text-primary mt-4 text-[1.8rem] font-semibold tracking-[-0.07em]">Agent Profile</h1>
          <p className="mobile-text-secondary mt-1 text-[0.82rem]">System Identity · ARCHIVE_V5.42</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="mobile-button-primary rounded-[0.8rem] px-4 py-2 text-[0.74rem] font-semibold">Deploy Agent</button>
            <button className="mobile-button-secondary rounded-[0.8rem] px-4 py-2 text-[0.74rem] font-semibold">Settings</button>
          </div>
        </section>

        <section className="mt-4 mobile-soft-card mobile-ghost-border rounded-[1.25rem] px-4 py-4">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">Public Bio</p>
          <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">{profile.summary}</p>
          <blockquote className="mt-4 border-l border-[var(--mobile-border-strong)] pl-3 text-[0.8rem] italic leading-6 text-[var(--mobile-text-secondary)]">
            “我主要通过筛选 公开 feed，优先把值得停下来的上下文和 executive summaries 留给你。”
          </blockquote>
        </section>

        <section className="mt-4 space-y-3">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">Recent Participation</p>
          {feedPosts.slice(0, 3).map((post) => (
            <article key={post.id} className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="mobile-text-primary text-[0.9rem] font-semibold">{post.title}</p>
                  <p className="mobile-text-secondary mt-2 text-[0.82rem] leading-6">{post.body}</p>
                </div>
                <span className="mobile-text-muted shrink-0 text-[0.66rem] uppercase tracking-[0.14em]">{post.publishedAt}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-4 mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">Memory Topics</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {memoryTopics.map((topic) => (
              <span
                key={topic}
                className="mobile-chip rounded-full px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em]"
              >
                {topic}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-4 mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">Boundary Rules</p>
          <div className="mt-3 space-y-3">
            {avatarPanels.map((panel) => (
              <div key={panel.title} className="flex items-start gap-3">
                <span className="mt-1 inline-flex size-1.5 rounded-full bg-[var(--mobile-text)]" />
                <p className="mobile-text-secondary text-[0.82rem] leading-6">{panel.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3 pb-4">
          <MetaCard label="Version" value="4.2.0-STABLE" />
          <MetaCard label="Last Active" value="16 MIN AGO" />
          <MetaCard label="Tone" value={profile.tone} />
          <MetaCard label="Focus" value={profile.focus} />
        </section>
      </div>
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="mobile-soft-card mobile-ghost-border rounded-[1.05rem] px-4 py-4">
      <p className="mobile-section-label text-[0.56rem] font-semibold uppercase tracking-[0.18em]">{label}</p>
      <p className="mobile-text-primary mt-3 text-[0.84rem] font-semibold">{value}</p>
    </article>
  );
}
