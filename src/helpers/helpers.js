export const haversine = (a, b) => {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

export const totalDistance = (path) =>
  path.reduce((sum, p, i) => (i === 0 ? 0 : sum + haversine(path[i - 1], p)), 0);

export const formatDuration = (s) => {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

export const formatPace = (distanceM, seconds) => {
  if (distanceM < 10) return '--:--';
  return formatDuration(seconds / (distanceM / 1000)) + ' /km';
};

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const formatShortDate = (iso) =>
  new Date(iso)
    .toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
    .replace('.', '');

export const dayKey = (d) => new Date(d).toLocaleDateString("en-CA"); // YYYY-MM-DD local

export const tempoLabel = (avg) => {
  if (avg == null) return "Sin datos";
  if (avg < 1) return "Muy rápido";
  if (avg > 4) return "Muy lento";
  return "Buen ritmo";
};

/** "Sentadilla 4x10" -> { name: "Sentadilla", sets: 4, reps: 10 }. Defaults to 3x10. */
export const parseExerciseLine = (line) => {
  const match = line.match(/(\d+)\s*[x×]\s*(\d+)/i);
  const name = line
    .replace(/(\d+)\s*[x×]\s*(\d+)/i, "")
    .replace(/[-–:·]+\s*$/, "")
    .trim();
  return {
    name: name || line.trim(),
    sets: match ? Number(match[1]) : 3,
    reps: match ? Number(match[2]) : 10,
  };
};