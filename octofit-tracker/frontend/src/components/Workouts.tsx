import { ApiResource } from './ApiResource.js';

type Workout = { title?: string; focus?: string; minutes?: number; difficulty?: string; reason?: string };

export default function Workouts() {
  const userEmail = encodeURIComponent('mona@example.com');
  return (
    <ApiResource<Workout>
      title="Workout suggestions"
      description="Recommend workouts from activity patterns."
      path={`/api/workouts/suggestions/${userEmail}`}
      collection="suggestions"
      emptyMessage="No workout suggestions available."
      renderItem={(workout) => (
        <>
          <strong>{workout.title ?? 'Workout'}</strong>
          {workout.focus && <> — {workout.focus}</>}
          {workout.minutes !== undefined && <> — {workout.minutes} minutes</>}
          {workout.difficulty && <> — {workout.difficulty}</>}
          {workout.reason && <p className="mb-0">{workout.reason}</p>}
        </>
      )}
    />
  );
}
