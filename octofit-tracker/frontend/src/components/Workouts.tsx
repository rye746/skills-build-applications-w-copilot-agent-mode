import { getJson } from '../api/client.js';
import { ApiResource } from './ApiResource.js';

type Workout = { title?: string; focus?: string; minutes?: number; difficulty?: string; reason?: string };

function loadWorkoutSuggestions() {
  const userEmail = encodeURIComponent('mona@example.com');
  return getJson<{ suggestions: Workout[] }>(`/api/workouts/suggestions/${userEmail}`)
    .then(({ suggestions }) => suggestions);
}

export default function Workouts() {
  return (
    <ApiResource<Workout>
      title="Workout suggestions"
      description="Recommend workouts from activity patterns."
      load={loadWorkoutSuggestions}
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
