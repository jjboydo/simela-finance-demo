type CsvValue = string | number | null | undefined;

const escapeCell = (value: CsvValue) => {
  const text = String(value ?? '');
  if (/[;"\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

/**
 * Genera y descarga un CSV compatible con Excel en español (separador ";" y BOM UTF-8).
 */
export function downloadCsv(filename: string, columns: string[], rows: CsvValue[][]) {
  const content = [columns, ...rows].map((row) => row.map(escapeCell).join(';')).join('\r\n');
  const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
