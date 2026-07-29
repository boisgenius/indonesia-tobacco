'use client';

import { createContext, useContext } from 'react';

// Lets every editable region report "the user has started typing" without
// threading a callback through each one.
export const TouchContext = createContext(() => {});

/**
 * A single editable text region.
 *
 * React owns the text node: state is only committed on blur, never on input.
 * That keeps the caret stable while typing, because nothing re-renders the
 * field until focus has already left it.
 */
export function Editable({ value, editing, onChange, as: Tag = 'span', className = '', ...rest }) {
  const onTouched = useContext(TouchContext);

  const handleBlur = (event) => {
    const next = event.currentTarget.innerText.replace(/ /g, ' ').replace(/\n$/, '');
    if (next !== value) onChange(next);
  };

  return (
    <Tag
      className={`${className}${editing ? ' editable-on' : ''}`}
      contentEditable={editing}
      suppressContentEditableWarning
      spellCheck={editing}
      // Flag unsaved work from the first keystroke, not only on blur, so the
      // toolbar and the leave-page guard can never tell the user their typing is
      // safe when it hasn't been committed. This re-render doesn't touch the DOM
      // text (the value prop is unchanged), so the caret stays where it is.
      onInput={editing ? onTouched : undefined}
      onBlur={editing ? handleBlur : undefined}
      {...rest}
    >
      {value}
    </Tag>
  );
}

export const editableCSS = `
  .editable-on {
    outline: 1px dashed transparent;
    outline-offset: 4px;
    border-radius: 3px;
    transition: outline-color 0.15s, background 0.15s;
  }
  .editable-on:hover { outline-color: #3d3d3d; }
  .editable-on:focus {
    outline: 1px dashed #6f6f6f;
    background: rgba(255, 255, 255, 0.03);
  }
`;
