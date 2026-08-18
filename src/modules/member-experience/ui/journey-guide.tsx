"use client";

import type { NextAction } from "../domain/next-action";

export function JourneyGuide({ nextAction }: { nextAction: NextAction }) {
  return <section className="journey-guide" aria-labelledby="journey-guide-title">
    <div>
      <p className="eyebrow">TutorIA · próximo passo</p>
      <h3 id="journey-guide-title">{nextAction.title}</h3>
      <p>{nextAction.description}</p>
    </div>
    <div className="journey-guide-actions">
      <a href={nextAction.href} className="primary-link">{nextAction.label}</a>
      <button type="button" className="button-quiet" onClick={() => window.dispatchEvent(new Event("mesa-os:open-tutoria"))}>Pedir ajuda à TutorIA</button>
    </div>
  </section>;
}
