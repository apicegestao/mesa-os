export function MentorNote({ materialUrl }: { materialUrl?: string }) {
  return <aside className="mentor-note" aria-labelledby="mentor-note-title">
    <div className="mentor-avatar" aria-hidden="true">LF</div>
    <div><p className="eyebrow light">Direção do Lula</p><blockquote id="mentor-note-title">“O trimestre não termina quando o conteúdo acaba. Termina quando a gestão muda.”</blockquote><small>Aula recomendada · Como instalar um ritmo de gestão que permanece</small></div>
    {materialUrl ? <a className="ghost-light" href={materialUrl} target="_blank" rel="noreferrer">Assistir · 9 min</a> : <span className="ghost-light unavailable" aria-label="Material aguardando endereço aprovado">Material em preparação</span>}
  </aside>;
}
