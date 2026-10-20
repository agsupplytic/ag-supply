import type { ProductSpecs } from "@/lib/content/types";

type Row = { label: string; value?: string };
type Group = { title: string; rows: Row[] };

function val(v?: string | number, unit = ""): string | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  return `${v}${unit}`;
}

function buildGroups(s: ProductSpecs): Group[] {
  const groups: Group[] = [
    {
      title: "Material y formato",
      rows: [
        { label: "Capas", value: val(s.ply) },
        { label: "Gramaje", value: val(s.grammageGsm, " g/m²") },
        { label: "Color", value: val(s.color) },
        { label: "Tipo de papel", value: val(s.paperType) },
        { label: "Doblez", value: val(s.fold) },
        { label: "Acabado", value: val(s.finish) },
      ],
    },
    {
      title: "Medidas",
      rows: [
        { label: "Ancho", value: val(s.widthCm, " cm") },
        { label: "Largo de hoja", value: val(s.sheetLengthCm, " cm") },
        { label: "Hojas por rollo o paquete", value: val(s.sheets) },
        { label: "Longitud del rollo", value: val(s.rollLengthM, " m") ?? val(s.rollLengthFt, " pies") },
      ],
    },
    {
      title: "Empaque y logística",
      rows: [
        { label: "Presentación", value: val(s.packFormat) },
        { label: "Paquetes por fardo", value: val(s.packsPerBale) },
        { label: "Dimensiones del paquete", value: val(s.packageDims) },
        { label: "Dimensiones del fardo o caja", value: val(s.caseDims) },
        { label: "Unidades por paleta", value: val(s.unitsPerPallet) },
      ],
    },
    { title: "Cumplimiento normativo", rows: [{ label: "Normas", value: val(s.compliance) }] },
  ];
  return groups
    .map((g) => ({ ...g, rows: g.rows.filter((r) => r.value) }))
    .filter((g) => g.rows.length > 0);
}

/** Ficha técnica: una tabla por grupo, solo con los datos que existen. */
export function SpecGroups({ specs }: { specs: ProductSpecs }) {
  const groups = buildGroups(specs);
  if (groups.length === 0) {
    return (
      <p className="max-w-xl border-l-4 border-border pl-4 text-body">
        La ficha técnica de este producto está en actualización. Escríbanos para las dimensiones
        completas o una muestra.
      </p>
    );
  }
  return (
    <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
      {groups.map((g) => (
        <section key={g.title}>
          <h3 className="label !text-ink">{g.title}</h3>
          <table className="spec-table mt-2">
            <tbody>
              {g.rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row">{r.label}</th>
                  <td>{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
