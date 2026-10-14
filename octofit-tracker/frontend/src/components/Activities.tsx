import { getJson } from '../api/client.js';
import { ApiResource } from './ApiResource.js';

type Activity = { type?: string; minutes?: number; points?: number; occurredAt?: string };

function loadActivities() {
  return getJson<{ activities: Activity[] }>('/api/activities').then(({ activities }) => activities);
}

export default function Activities() {
  return (
    <ApiResource<Activity>
      title="Activities"
      description="Track student activity minutes and points."
      load={loadActivities}
      emptyMessage="No activities yet."
      renderItem={(activity) => (
        <>
          <strong>{activity.type ?? 'Activity'}</strong>
          {' — '}{activity.minutes ?? 0} minutes
          {' — '}{activity.points ?? 0} points
        </>
      )}
    />
  );
}
