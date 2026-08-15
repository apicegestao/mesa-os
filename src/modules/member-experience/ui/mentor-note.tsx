export function MentorNote({ materialUrl, message = "O trimestre não termina quando o conteúdo acaba. Termina quando a gestão muda.", materialTitle = "Como instalar um ritmo de gestão que permanece" }: { materialUrl?: string; message?: string; materialTitle?: string }) {
  return <aside className="mentor-note" aria-labelledby="mentor-note-title">
    <div className="mentor-avatar" aria-hidden="true">LF</div>
    <div><p className="eyebrow light">Direção do Lula</p><blockquote id="mentor-note-title">“{message}”</blockquote><small>Aula recomendada · {materialTitle}</small></div>
    {materialUrl ? <a className="ghost-light" href={materialUrl} target="_blank" rel="noreferrer">Assistir · 9 min</a> : <span className="ghost-light unavailable" aria-label="Material aguardando endereço aprovado">Material em preparação</span>}
  </aside>;
}
