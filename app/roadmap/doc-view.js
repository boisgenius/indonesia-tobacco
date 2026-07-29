'use client';

import { Editable } from './editable';

export function DocView({ doc, editing, mutate }) {
  return (
    <>
      <div className="intro">
        {doc.intro.map((para, pi) => (
          <Editable
            key={para.id}
            as="p"
            editing={editing}
            value={para.text}
            onChange={(v) => mutate((d) => { d.intro[pi].text = v; })}
          />
        ))}
      </div>

      {doc.parts.map((part, partIndex) => (
        <section className="part" key={part.id}>
          <Editable
            as="h2"
            className="part-label"
            editing={editing}
            value={part.label}
            onChange={(v) => mutate((d) => { d.parts[partIndex].label = v; })}
          />

          {(part.lead || editing) && (
            <Editable
              as="p"
              className="part-lead"
              editing={editing}
              value={part.lead}
              onChange={(v) => mutate((d) => { d.parts[partIndex].lead = v; })}
            />
          )}

          {part.steps.map((step, stepIndex) => (
            <div className="step" key={step.id}>
              <div className="step-head">
                <span className="step-num">Step {step.num}</span>
                <Editable
                  as="h3"
                  className="step-title"
                  editing={editing}
                  value={step.title}
                  onChange={(v) => mutate((d) => { d.parts[partIndex].steps[stepIndex].title = v; })}
                />
                {editing ? (
                  <button
                    type="button"
                    className={`flag flag-toggle${step.needsConfirmation ? '' : ' flag-off'}`}
                    onClick={() =>
                      mutate((d) => {
                        const target = d.parts[partIndex].steps[stepIndex];
                        target.needsConfirmation = !target.needsConfirmation;
                      })
                    }
                    title="Toggle the confirmation flag"
                  >
                    {step.needsConfirmation ? 'Needs confirmation' : 'Confirmed'}
                  </button>
                ) : (
                  step.needsConfirmation && <span className="flag">Needs confirmation</span>
                )}
              </div>

              <div className="fields">
                {step.fields.map((field, fieldIndex) => (
                  <div className="field" key={field.id}>
                    <Editable
                      className="field-label"
                      editing={editing}
                      value={field.label}
                      onChange={(v) =>
                        mutate((d) => { d.parts[partIndex].steps[stepIndex].fields[fieldIndex].label = v; })
                      }
                    />
                    <Editable
                      className="field-text"
                      editing={editing}
                      value={field.text}
                      onChange={(v) =>
                        mutate((d) => { d.parts[partIndex].steps[stepIndex].fields[fieldIndex].text = v; })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {(part.footnote || editing) && (
            <Editable
              as="p"
              className="footnote"
              editing={editing}
              value={part.footnote}
              onChange={(v) => mutate((d) => { d.parts[partIndex].footnote = v; })}
            />
          )}

          {part.callout && (
            <Editable
              as="p"
              className="callout"
              editing={editing}
              value={part.callout.text}
              onChange={(v) => mutate((d) => { d.parts[partIndex].callout.text = v; })}
            />
          )}
        </section>
      ))}

      <section className="quick-map">
        <Editable
          as="h2"
          className="part-label"
          editing={editing}
          value={doc.quickMap.title}
          onChange={(v) => mutate((d) => { d.quickMap.title = v; })}
        />

        <div className="map-rows">
          {doc.quickMap.rows.map((row, rowIndex) => (
            <div className={`map-row${row.key ? ' map-row-key' : ''}`} key={row.id}>
              <Editable
                className="map-when"
                editing={editing}
                value={row.when}
                onChange={(v) => mutate((d) => { d.quickMap.rows[rowIndex].when = v; })}
              />
              <div className="map-what">
                <Editable
                  editing={editing}
                  value={row.what}
                  onChange={(v) => mutate((d) => { d.quickMap.rows[rowIndex].what = v; })}
                />
                {(row.sub || editing) && (
                  <Editable
                    className="map-sub"
                    editing={editing}
                    value={row.sub}
                    onChange={(v) => mutate((d) => { d.quickMap.rows[rowIndex].sub = v; })}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <Editable
          as="p"
          className="rule-box"
          editing={editing}
          value={doc.quickMap.rule}
          onChange={(v) => mutate((d) => { d.quickMap.rule = v; })}
        />
      </section>

      <Editable
        as="p"
        className="related"
        editing={editing}
        value={doc.related}
        onChange={(v) => mutate((d) => { d.related = v; })}
      />
    </>
  );
}

export const docCSS = `
  .intro {
    margin-top: 2.5rem;
    padding-top: 2rem;
    border-top: 1px solid #222;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .intro p { color: #b9b9b9; font-size: 1rem; line-height: 1.65; }

  .part { margin-top: 3.5rem; }

  .part-label {
    font-size: 0.95rem;
    font-weight: 900;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #fff;
    padding: 14px 18px;
    background: #131313;
    border-left: 3px solid #fff;
    border-radius: 0 8px 8px 0;
  }

  .part-lead {
    color: #8f8f8f;
    font-style: italic;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-top: 1.25rem;
  }

  .step { padding: 1.75rem 0; border-bottom: 1px solid #1c1c1c; }

  .step-head { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }

  .step-num {
    color: #6d6d6d;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .step-title {
    font-size: 1.28rem;
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: -0.01em;
    flex: 1 1 320px;
  }

  .flag {
    font: inherit;
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    padding: 5px 9px;
    border-radius: 999px;
    border: 1px solid rgba(245, 165, 36, 0.45);
    background: rgba(245, 165, 36, 0.12);
    color: #f5a524;
    white-space: nowrap;
  }

  .flag-toggle { cursor: pointer; }
  .flag-off { border-color: #333; background: transparent; color: #5c5c5c; }

  .fields {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    padding-left: 2px;
  }

  .field { display: grid; grid-template-columns: 108px minmax(0, 1fr); gap: 14px; align-items: start; }

  .field-label {
    color: #7f7f7f;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding-top: 4px;
  }

  .field-text { color: #d2d2d2; font-size: 0.98rem; line-height: 1.62; white-space: pre-wrap; }

  .footnote { color: #767676; font-style: italic; font-size: 0.9rem; line-height: 1.6; margin-top: 1.25rem; }

  .callout {
    margin-top: 1.75rem;
    padding: 16px 18px;
    border-radius: 10px;
    border: 1px solid rgba(245, 165, 36, 0.4);
    background: rgba(245, 165, 36, 0.08);
    color: #f0c37a;
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.6;
  }

  .quick-map { margin-top: 3.5rem; }

  .map-rows { margin-top: 1.5rem; border: 1px solid #222; border-radius: 10px; overflow: hidden; }

  .map-row { display: grid; grid-template-columns: 190px minmax(0, 1fr); border-bottom: 1px solid #1c1c1c; }
  .map-row:last-child { border-bottom: none; }

  .map-when {
    background: #141414;
    padding: 14px 18px;
    font-size: 0.82rem;
    font-weight: 800;
    letter-spacing: 0.03em;
    color: #fff;
  }

  .map-what { padding: 14px 18px; font-size: 0.95rem; line-height: 1.5; color: #c9c9c9; }

  .map-row-key .map-what { background: rgba(107, 203, 119, 0.07); color: #d6f0da; }
  .map-row-key .map-when { background: #17231a; }

  .map-sub { display: block; color: #7c7c7c; font-style: italic; font-size: 0.85rem; margin-top: 6px; }

  .rule-box {
    margin-top: 1.75rem;
    padding: 16px 18px;
    border-radius: 10px;
    border: 1px solid #2f2f3d;
    background: #101018;
    color: #cfcfe4;
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.6;
  }

  .related {
    margin-top: 2.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #1c1c1c;
    color: #6f6f6f;
    font-style: italic;
    font-size: 0.88rem;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .field { grid-template-columns: 1fr; gap: 2px; }
    .field-label { padding-top: 0; }
    .map-row { grid-template-columns: 1fr; }
    .map-when { padding-bottom: 6px; }
  }
`;
