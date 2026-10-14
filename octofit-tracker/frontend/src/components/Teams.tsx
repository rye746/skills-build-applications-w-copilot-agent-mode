import { getJson } from '../api/client.js';
import { ApiResource } from './ApiResource.js';

type Team = { name?: string; mascot?: string; members?: (string | { name?: string; _id?: string })[] };

function loadTeams() {
  return getJson<{ teams: Team[] }>('/api/teams').then(({ teams }) => teams);
}

export default function Teams() {
  return (
    <ApiResource<Team>
      title="Teams"
      description="Manage teams and members."
      load={loadTeams}
      emptyMessage="No teams yet."
      renderItem={(team) => (
        <>
          <strong>{team.name ?? 'Team'}</strong>
          {team.mascot && <> — Mascot: {team.mascot}</>}
          {team.members && (
            <> — Members: {team.members.map((member) => typeof member === 'string' ? member : member.name ?? member._id ?? 'Member').join(', ')}</>
          )}
        </>
      )}
    />
  );
}
