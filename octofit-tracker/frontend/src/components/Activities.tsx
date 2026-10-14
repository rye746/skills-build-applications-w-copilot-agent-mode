import { ApiResource } from './ApiResource.js';

type Activity = { type?: string; minutes?: number; points?: number; occurredAt?: string };

export default function Activities() {
  return (
    <ApiResource<Activity>
      title="Activities"
      description="Track student activity minutes and points."
      path="/api/activities"
      collection="activities"
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
