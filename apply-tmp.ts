import { cabinTypes, cabinDetails, AREA_LABEL_VI, AREA_NOTE_VI, AREA_LABEL_EN } from "@/components/cabins/cabins-data";
import { itineraries } from "@/components/itineraries/itineraries-data";
import { services } from "@/components/services/services-data";
import { offers } from "@/components/offers/offers-data";
import { jobPositions } from "@/components/careers/careers-data";
import { getT } from "@/lib/translations";

const url = process.env["SUPABASE_URL"]!;
const key = process.env["SUPABASE_SERVICE_ROLE_KEY"]!;
const H = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

const sel = async (path: string) => {
  const r = await fetch(`${url}/rest/v1/${path}`, { headers: H });
  if (!r.ok) throw new Error(`${path}: ${r.status} ${await r.text()}`);
  return (await r.json()) as any[];
};
const counts: Record<string, number> = {};
const patch = async (table: string, id: string, body: Record<string, unknown>) => {
  const r = await fetch(`${url}/rest/v1/${table}?id=eq.${id}`, { method: "PATCH", headers: H, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`${table} ${id}: ${r.status} ${await r.text()}`);
  counts[table] = (counts[table] ?? 0) + 1;
};
const tr = (row: any, vi: Record<string, unknown>) => ({ translations: { ...(row.translations ?? {}), vi } });

const ship = (await sel("ships?slug=eq.chronos&select=id,translations"))[0];
const S = ship.id as string;
const vi = getT("vi");
const unmatched: string[] = [];

/* cabins + cabin_details */
const cabinRows = await sel(`cabins?ship_id=eq.${S}&select=id,slug,translations`);
const detailRows = await sel(`cabin_details?ship_id=eq.${S}&select=id,cabin_id,content_type,label,sort_order,value,translations`);
for (const c of cabinTypes) {
  const row = cabinRows.find((r) => r.slug === c.id);
  if (!row) { unmatched.push(`cabin ${c.id}`); continue; }
  await patch("cabins", row.id, tr(row, {
    name: c.nameVi, summary: c.descVi, description: c.descVi,
    bed_config: c.bedVi, view_type: c.view.split(" / ")[0]!.trim(),
  }));
  const d = cabinDetails[c.id];
  const mine = detailRows.filter((r) => r.cabin_id === row.id);
  const find = (ct: string, pred: (r: any) => boolean) => mine.find((r) => r.content_type === ct && pred(r));

  for (const [i, a] of c.amenitiesVi.entries()) {
    const r = find("amenity", (x) => x.sort_order === i + 1);
    if (r) await patch("cabin_details", r.id, tr(r, { label: a })); else unmatched.push(`${c.id} amenity ${i + 1}`);
  }
  for (const [i, h] of (d?.highlightsVi ?? []).entries()) {
    const r = find("highlight", (x) => x.sort_order === i + 1);
    if (r) await patch("cabin_details", r.id, tr(r, { label: h })); else unmatched.push(`${c.id} highlight ${i + 1}`);
  }
  if (d) {
    const r = find("layout", () => true);
    if (r) await patch("cabin_details", r.id, tr(r, {
      label: "Sơ đồ bố trí",
      value: JSON.stringify(d.layout.map((z) => ({ label: z.labelVi, x: z.x, y: z.y, w: z.w, h: z.h }))),
    }));
  }
  const specVi: Record<string, { label: string; value?: string }> = {
    "Technical code": { label: "Mã kỹ thuật" },
    [AREA_LABEL_EN]: { label: AREA_LABEL_VI },
    Area: { label: "Diện tích" },
    "Area note": { label: "Ghi chú diện tích", value: AREA_NOTE_VI },
    View: { label: "Tầm nhìn", value: c.view.split(" / ")[0]!.trim() },
    "Rooms of this type aboard": { label: "Số phòng thuộc hạng này trên tàu" },
    Capacity: { label: "Sức chứa", value: d?.capacityVi },
    "Bed configuration": { label: "Cấu hình giường", value: d?.bedVi },
    Deck: { label: "Vị trí", value: d?.deckVi },
  };
  for (const [en, t] of Object.entries(specVi)) {
    const r = find("spec", (x) => x.label === en);
    if (!r) continue;
    await patch("cabin_details", r.id, tr(r, t.value ? { label: t.label, value: t.value } : { label: t.label }));
  }
}
const missedSpecs = detailRows.filter((r) => r.content_type === "spec").length;
void missedSpecs;

/* itineraries + days */
const itRows = await sel(`itineraries?ship_id=eq.${S}&select=id,slug,translations`);
const dayRows = await sel(`itinerary_days?ship_id=eq.${S}&select=id,itinerary_id,day_number,timeline,translations`);
for (const it of itineraries) {
  const row = itRows.find((r) => r.slug === it.id);
  if (!row) { unmatched.push(`itinerary ${it.id}`); continue; }
  await patch("itineraries", row.id, tr(row, {
    name: it.nameVi, summary: it.descVi, description: it.descVi,
    highlights: { duration: it.durationVi, items: it.highlightsVi, includes: it.includesVi, excludes: it.excludesVi },
  }));
  const map = new Map(it.timelineVi.map((t) => [t.time, t.label.replace(/^Ngày\s*\d+:\s*/i, "")]));
  for (const day of dayRows.filter((r) => r.itinerary_id === row.id)) {
    const timeline = (day.timeline ?? []).map((e: any) => ({ time: e.time, label: map.get(e.time) ?? e.label }));
    await patch("itinerary_days", day.id, tr(day, { title: `Ngày ${day.day_number}`, timeline }));
  }
}

/* services */
const svcRows = await sel(`services?ship_id=eq.${S}&select=id,slug,translations`);
for (const s of services) {
  const row = svcRows.find((r) => r.slug === s.id);
  if (!row) { unmatched.push(`service ${s.id}`); continue; }
  await patch("services", row.id, tr(row, {
    name: s.nameVi, summary: s.menuDescVi, description: s.introVi,
    highlights: {
      menuName: s.menuNameVi, eyebrow: s.eyebrowVi, tagline: s.taglineVi,
      items: s.highlights.map((h) => ({ title: h.titleVi, desc: h.descVi })),
    },
  }));
}

/* offers: highlights column + cleaned description + translations */
const offerRows = await sel(`offers?ship_id=eq.${S}&select=id,slug,translations`);
for (const o of offers) {
  const row = offerRows.find((r) => r.slug === o.id);
  if (!row) { unmatched.push(`offer ${o.id}`); continue; }
  await patch("offers", row.id, {
    highlights: o.highlightsEn,
    description: o.descEn,
    translations: {
      ...(row.translations ?? {}),
      vi: {
        name: o.nameVi, badge: o.badgeVi, value_text: o.badgeVi,
        description: o.descVi, terms: o.termsVi.join("\n"), highlights: o.highlightsVi,
      },
    },
  });
}

/* job positions */
const jobRows = await sel(`job_positions?ship_id=eq.${S}&select=id,slug,translations`);
for (const p of jobPositions) {
  const row = jobRows.find((r) => r.slug === p.id);
  if (!row) { unmatched.push(`job ${p.id}`); continue; }
  await patch("job_positions", row.id, tr(row, {
    title: p.titleVi, department: p.departmentVi, employment_type: p.typeVi, description: p.descVi,
  }));
}

/* ship pages */
const pageRows = await sel(`ship_pages?ship_id=eq.${S}&select=id,slug,translations`);
const pageVi: Record<string, Record<string, unknown>> = {
  about: {
    title: vi.about.title, intro: vi.about.label, content: vi.about.body,
    seo_title: "Giới thiệu Chronos Cruise | Du thuyền 6 sao Hạ Long - Lan Hạ",
    seo_description: "Tìm hiểu về Chronos Cruise: tinh thần phục vụ, giá trị cốt lõi và trải nghiệm nghỉ dưỡng 6 sao giữa vịnh Hạ Long - Lan Hạ.",
  },
  contact: {
    title: vi.contact.title, intro: vi.contact.label,
    content: `${vi.contact.subtitle}\n\n${vi.contact.address}: ${vi.contact.addressValue}\n${vi.contact.hours}: ${vi.contact.hoursValue}`,
    seo_title: "Liên hệ Chronos Cruise | Hotline, Zalo & bản đồ bến tàu Hạ Long",
    seo_description: "Liên hệ Chronos Cruise: hotline, Zalo, email đặt phòng và bản đồ vị trí bến tàu tại Cảng tàu khách quốc tế Hạ Long. Gửi tin nhắn để được tư vấn trong 24 giờ.",
  },
};
for (const [slug, body] of Object.entries(pageVi)) {
  const row = pageRows.find((r) => r.slug === slug);
  if (row) await patch("ship_pages", row.id, tr(row, body));
}

/* homepage sections */
const secRows = await sel(`homepage_sections?ship_id=eq.${S}&select=id,section_type,translations`);
const secVi: Record<string, Record<string, unknown>> = {
  hero: { tagline: vi.hero.tagline, title: vi.hero.title, title_accent: vi.hero.titleAccent, subtitle: vi.hero.subtitle, cta: vi.hero.cta, scroll: vi.hero.scroll },
  recruit_teaser: { label: vi.recruitTeaser.label, title: vi.recruitTeaser.title, title_accent: vi.recruitTeaser.titleAccent, subtitle: vi.recruitTeaser.subtitle, cta: vi.recruitTeaser.viewAll },
  gallery: { label: vi.gallery.label, title: vi.gallery.title, subtitle: vi.gallery.subtitle, captions: vi.gallery.captions },
  quote_form: { label: vi.form.label, title: vi.form.title, subtitle: vi.form.subtitle, submit: vi.form.submit, success: vi.form.success },
};
for (const [type, body] of Object.entries(secVi)) {
  const row = secRows.find((r) => r.section_type === type);
  if (row) await patch("homepage_sections", row.id, tr(row, body));
}

/* ship-level */
await patch("ships", S, tr(ship, { display_name: "Chronos Cruise", tagline: vi.footer.tagline }));
const setRow = (await sel(`ship_settings?ship_id=eq.${S}&select=id,translations`))[0];
if (setRow) await patch("ship_settings", setRow.id, tr(setRow, {
  address: vi.contact.addressValue,
  checkin_point: "Cảng tàu khách quốc tế Hạ Long, TP. Hạ Long, Quảng Ninh",
  hotline_display: "+84 902 952 356",
}));
const seoRow = (await sel(`ship_seo?ship_id=eq.${S}&select=id,translations`))[0];
if (seoRow) await patch("ship_seo", seoRow.id, tr(seoRow, {
  site_name: "Chronos Cruise",
  title_template: "%s | Chronos Cruise",
  default_title: "Chronos Cruise — Du thuyền nghỉ đêm 6 sao tại vịnh Hạ Long",
  default_description: "Chronos Cruise mang đến hành trình nghỉ đêm tinh tế qua vịnh Hạ Long và Lan Hạ với suite sang trọng, nhà hàng tầm nhìn panorama và trải nghiệm được tuyển chọn.",
}));

console.log(JSON.stringify({ counts, unmatched }, null, 2));
