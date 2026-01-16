import { Counter, type CounterProps } from './Counter.tsx';
import { Button } from './Button.tsx';

export type ColumnProps = {
  onDrop: () => void;
} & Counters;

export type Counters = {
  counters: [
    CounterProps,
    CounterProps,
    CounterProps,
    CounterProps,
    CounterProps,
    CounterProps,
    CounterProps,
  ],
}

export function Column({counters, onDrop}: ColumnProps) {
  function handleDrop() {
    onDrop();
  };

  const displayCounters = counters.toReversed();

  return (
    <div className="column">
      <Button label="Drop" onClick={handleDrop} />
      {
        displayCounters.map((counterProps: CounterProps, index: number) => (
          <Counter key={index} {...counterProps} />
        ))
      }
    </div>
  );
}