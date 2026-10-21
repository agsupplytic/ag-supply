import { Layers, PackageOpen, Ruler, ShieldCheck, type LucideIcon } from "lucide-react";
import type { ProductSpecs } from "@/lib/content/types";
import { specValue } from "@/lib/i18n/content";
import type { Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import { IconChip } from "./icon-chip";

type Row = { label: string; value?: string };
type Group = { title: string; icon: LucideIcon; rows: Row[] };

function val(v?: string | number, unit = ""): string | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  return `${v}${unit}`;
}

function buildGroups(s: ProductSpecs, lang: Lang): Group[] {
  const t = ui(lang).product;
  const sv = (v?: string) => (v ? specValue(v, lang) : undefined);
  const groups: Group[] = [
    {
      title: t.groups.material,
      icon: Layers,
      rows: [
        { label: t.rows.ply, value: val(s.ply) },
        { label: t.rows.grammage, value: val(s.grammageGsm, t.units.gsm) },
        { label: t.rows.color, value: sv(s.color) },
        { label: t.rows.paperType, value: sv(s.paperType) },
        { label: t.rows.fold, value: sv(s.fold) },
        { label: t.rows.finish, value: sv(s.finish) },
      ],
    },
    {
      title: t.groups.measures,
      icon: Ruler,
      rows: [
        { label: t.rows.width, value: val(s.widthCm, t.units.cm) },
        { label: t.rows.sheetLength, value: val(s.sheetLengthCm, t.units.cm) },
        { label: t.rows.sheets, value: val(s.sheets) },
        { label: t.rows.rollLength, value: val(s.rollLengthM, t.units.m) ?? val(s.rollLengthFt, t.units.ft) },
      ],
    },
    {
      title: t.groups.packing,
      icon: PackageOpen,
      rows: [
        { label: t.rows.pack, value: val(s.packFormat) },
        { label: t.rows.packsPerBale, value: val(s.packsPerBale) },
        { label: t.rows.packageDims, value: val(s.packageDims) },
        { label: t.rows.caseDims, value: val(s.caseDims) },
        { label: t.rows.unitsPerPallet, value: val(s.unitsPerPallet) },
      ],
    },
    { title: t.groups.compliance, icon: ShieldCheck, rows: [{ label: t.rows.standards, value: val(s.compliance) }] },
  ];
  return groups.map((g) => ({ ...g, rows: g.rows.filter((r) => r.value) })).filter((g) => g.rows.length > 0);
}

/** Ficha técnica: una tabla por grupo (con su icono), solo con los datos que existen. */
export function SpecGroups({ specs, lang }: { specs: ProductSpecs; lang: Lang }) {
  const groups = buildGroups(specs, lang);
  if (groups.length === 0) {
    return <p className="max-w-xl rounded-lg border border-dashed border-control-border bg-white p-5 text-body">{ui(lang).product.pending}</p>;
  }
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {groups.map((g) => (
        <section key={g.title} className="card p-5">
          <div className="flex items-center gap-3">
            <IconChip icon={g.icon} />
            <h3 className="!text-lg">{g.title}</h3>
          </div>
          <table className="spec-table mt-3">
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
