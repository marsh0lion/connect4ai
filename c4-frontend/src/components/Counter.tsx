export type CounterProps = {
  player: 'o' | 'x' | undefined
}

export function Counter({player}: CounterProps) {
  let ariaLabel: string = 'Empty';
  if (player === 'o') {
    ariaLabel = 'Player 1 counter';
  } else if (player === 'x') {
    ariaLabel = 'Player 2 counter';
  }

  return (
    <div
      className={`counter counter--${player}`}
      aria-label={ariaLabel}
    />
  )
}