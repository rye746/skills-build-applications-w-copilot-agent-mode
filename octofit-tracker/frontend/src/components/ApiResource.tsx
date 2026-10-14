import { useEffect, useState, type ReactNode } from 'react';
import { getJson } from '../api/client.js';

type Props<T> = {
  title: string;
  description: string;
  path: string;
  collection: string;
  emptyMessage: string;
  renderItem: (item: T) => ReactNode;
};

type ResourceState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; items: T[] };

export function ApiResource<T>({ title, description, path, collection, emptyMessage, renderItem }: Props<T>) {
  const [state, setState] = useState<ResourceState<T>>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });
    getJson<Record<string, unknown>>(path)
      .then((response) => {
        const items = response[collection];
        if (!Array.isArray(items)) throw new Error(`Invalid ${collection} response`);
        if (active) setState({ status: 'success', items: items as T[] });
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'An unexpected error occurred.',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [path, collection]);

  return (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h4">{title}</h2>
        <p>{description}</p>
        {state.status === 'loading' && <p role="status">Loading {title.toLowerCase()}...</p>}
        {state.status === 'error' && (
          <p role="alert">Unable to load {title.toLowerCase()}: {state.message}</p>
        )}
        {state.status === 'success' && state.items.length === 0 && <p>{emptyMessage}</p>}
        {state.status === 'success' && state.items.length > 0 && (
          <ul className="list-group">
            {state.items.map((item, index) => (
              <li className="list-group-item" key={index}>{renderItem(item)}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
