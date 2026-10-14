import { ApiResource } from './ApiResource.js';

type Ranking = { teamName?: string; totalPoints?: number; rank?: number };

export default function Leaderboard() {
  return (
    <ApiResource<Ranking>
      title="Leaderboard"
      description="Compare team point totals."
      path="/api/leaderboard"
      collection="leaderboard"
      emptyMessage="No leaderboard rankings yet."
      renderItem={(ranking) => (
        <>
          <strong>#{ranking.rank ?? '-'} {ranking.teamName ?? 'Team'}</strong>
          {' — '}{ranking.totalPoints ?? 0} points
        </>
      )}
    />
  );
}
