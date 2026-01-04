import { Counter, type CounterProps } from './Counter.tsx';
import { Button} from './Button.tsx';

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
  function handleDrop() {
    console.log('dropping in column');
  }

  return (
    <div className="column">
      <Button label="Drop" onClick={handleDrop} />
      {
        counters.map((counterProps: CounterProps, index: number) => (
          <Counter key={index} {...counterProps} />
        ))
      }
    </div>
  )
}