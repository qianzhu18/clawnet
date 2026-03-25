type PairingQrProps = {
  code: string;
  size?: number;
};

function hashCode(input: string) {
  let value = 0;
  for (let i = 0; i < input.length; i += 1) {
    value = (value * 31 + input.charCodeAt(i)) >>> 0;
  }
  return value;
}

export function PairingQr({ code, size = 180 }: PairingQrProps) {
  const cells = 21;
  const padding = 3;
  const cell = size / (cells + padding * 2);
  const bits: boolean[][] = [];
  let seed = hashCode(code);

  for (let row = 0; row < cells; row += 1) {
    const currentRow: boolean[] = [];
    for (let col = 0; col < cells; col += 1) {
      const inFinder =
        (row < 5 && col < 5) ||
        (row < 5 && col > cells - 6) ||
        (row > cells - 6 && col < 5);

      if (inFinder) {
        const edge = row === 0 || row === 4 || col === 0 || col === 4;
        const center = row >= 1 && row <= 3 && col >= 1 && col <= 3;
        currentRow.push(edge || center);
        continue;
      }

      seed = (seed * 1664525 + 1013904223) >>> 0;
      currentRow.push((seed & 3) === 0 || ((row + col + seed) & 7) === 0);
    }
    bits.push(currentRow);
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-[1.5rem] bg-white p-4 shadow-[0_18px_40px_rgba(32,24,16,0.08)]">
      <rect x="0" y="0" width={size} height={size} rx="24" fill="white" />
      {bits.map((row, rowIndex) =>
        row.map((filled, colIndex) => {
          if (!filled) {
            return null;
          }

          return (
            <rect
              key={`${rowIndex}-${colIndex}`}
              x={(colIndex + padding) * cell}
              y={(rowIndex + padding) * cell}
              width={cell}
              height={cell}
              rx={cell * 0.2}
              fill="#1f1d1a"
            />
          );
        }),
      )}
    </svg>
  );
}
