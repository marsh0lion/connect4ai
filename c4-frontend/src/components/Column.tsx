import { Counter, type CounterProps } from './Counter.tsx';

export type ColumnProps = {
  counters: [
    CounterProps,
    CounterProps,
    CounterProps,
    CounterProps,
    CounterProps,
    CounterProps,
    CounterProps,
  ]
}

export function Column({counters}: ColumnProps) {
  return (
    <div className="column">
      {
        counters.map((counterProps: CounterProps, index: number) => (
          <Counter key={index} {...counterProps} />
        ))
      }
    </div>
  )
}