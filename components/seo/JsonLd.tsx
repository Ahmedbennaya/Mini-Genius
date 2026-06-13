import { Fragment } from "react";

type JsonLdData = Record<string, unknown>;

/**
 * Renders one or more JSON-LD structured-data blocks.
 * Server component — the markup is in the initial HTML so crawlers read it
 * without executing JS. Safe to use on any server-rendered page or section.
 */
export default function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  const blocks = Array.isArray(data) ? data : [data];

  return (
    <>
      {blocks.map((block, index) => (
        <Fragment key={index}>
          <script
            type="application/ld+json"
            // JSON.stringify output is safe; we additionally escape "<" to avoid
            // any chance of breaking out of the script tag.
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(block).replace(/</g, "\\u003c"),
            }}
          />
        </Fragment>
      ))}
    </>
  );
}
