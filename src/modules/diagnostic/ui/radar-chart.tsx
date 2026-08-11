import type { DiagnosticResult } from "../domain/diagnostic";

export function RadarChart({ dimensions }: { dimensions: DiagnosticResult["dimensions"] }) {
  const center = 110;
  const radius = 82;
  const point = (index: number, value = 100) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / dimensions.length;
    const scaled = radius * (value / 100);
    return `${center + Math.cos(angle) * scaled},${center + Math.sin(angle) * scaled}`;
  };
  const polygon = dimensions.map((dimension, index) => point(index, dimension.score)).join(" ");

  return (
    <figure className="radar" aria-label="Resultado por dimensão">
      <svg viewBox="0 0 220 220" role="img" aria-labelledby="radar-title radar-desc">
        <title id="radar-title">Perfil por dimensão</title>
        <desc id="radar-desc">{dimensions.map((item) => `${item.label}: ${item.score} de 100`).join("; ")}</desc>
        {[20, 40, 60, 80, 100].map((level) => <polygon key={level} points={dimensions.map((_, index) => point(index, level)).join(" ")} className="radar-grid" />)}
        {dimensions.map((_, index) => <line key={index} x1={center} y1={center} x2={point(index).split(",")[0]} y2={point(index).split(",")[1]} className="radar-axis" />)}
        <polygon points={polygon} className="radar-value" />
        {dimensions.map((dimension, index) => {
          const [x, y] = point(index, 118).split(",");
          return <text key={dimension.code} x={x} y={y} textAnchor="middle" dominantBaseline="middle">{dimension.label}</text>;
        })}
      </svg>
    </figure>
  );
}
