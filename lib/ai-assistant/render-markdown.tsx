import { Fragment } from "react";

/**
 * Minimal markdown renderer scoped to exactly what the assistant's replies
 * use: **bold** spans, "- " bullet lists, and paragraph breaks. Deliberately
 * avoids pulling in a full markdown library (and avoids dangerouslySetInnerHTML)
 * since the assistant's own output is the only input this ever renders.
 */
export function renderMarkdown(content: string): React.ReactNode {
  const blocks = content.split(/\n\n+/);

  return (
    <>
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").filter((l) => l.length > 0);
        const isList = lines.length > 0 && lines.every((l) => l.trim().startsWith("- "));

        if (isList) {
          return (
            <ul key={blockIndex} className="my-1.5 list-disc space-y-1 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInline(line.trim().slice(2))}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={blockIndex} className={blockIndex > 0 ? "mt-2" : undefined}>
            {lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 && <br />}
                {renderInline(line)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

/** Renders **bold** spans within a single line of text. */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter((p) => p.length > 0);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}
