import { getJson } from '../api/client.js';
import { ApiResource } from './ApiResource.js';

type Ranking = { teamName?: string; totalPoints?: number; rank?: number };

function loadLeaderboard() {
  return getJson<{ leaderboard: Ranking[] }>('/api/leaderboard').then(({ leaderboard }) => leaderboard);
}

export default function Leaderboard() {
  return (
    <ApiResource<Ranking>
      title="Leaderboard"
      description="Compare team point totals."
      load={loadLeaderboard}
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
