export type CounterProps = {
  player: 'o' | 'x'
}

export function Counter({player}: CounterProps) {
  const ariaLabel = player === 'o' ? 'Player 1 counter' : 'Player 2 counter'

  return (
    <div
      className={`counter counter--${player}`}
      aria-label={ariaLabel}
    />
  )
}