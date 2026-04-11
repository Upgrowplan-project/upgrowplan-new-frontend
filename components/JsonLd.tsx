/**
 * Server component — renders one or multiple JSON-LD <script> tags in <head>.
 * Usage: <JsonLd data={organizationSchema()} />
 *        <JsonLd data={[schema1, schema2]} />
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const schemas = Array.isArray(data) ? data : [data];
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
