"use client";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import type { Components } from "react-markdown";

/** Cómo se pinta el markdown del modelo, en el hilo y en el canvas: variantes de tipografía y componentes de MUI del tema. */
export const COMPONENTES_MARKDOWN: Components = {
  // Los títulos se dimensionan en `em` sobre `body1`: así escalan con cualquier tema de MUI (las variantes h1..h6 varían mucho entre temas).
  h1: ({ children }) => <Typography variant="body1" component="h1" sx={{ fontSize: "1.375em", fontWeight: 600, lineHeight: 1.3, mb: 1.5 }}>{children}</Typography>,
  h2: ({ children }) => <Typography variant="body1" component="h2" sx={{ fontSize: "1.125em", fontWeight: 600, lineHeight: 1.3, mt: 2.5, mb: 1 }}>{children}</Typography>,
  h3: ({ children }) => <Typography variant="subtitle1" component="h3" sx={{ mt: 2, mb: 0.5 }}>{children}</Typography>,
  p: ({ children }) => <Typography variant="body1" sx={{ mb: 1, "&:last-child": { mb: 0 } }}>{children}</Typography>,
  ul: ({ children }) => <Box component="ul" sx={{ m: 0, mb: 1, pl: 3 }}>{children}</Box>,
  ol: ({ children }) => <Box component="ol" sx={{ m: 0, mb: 1, pl: 3 }}>{children}</Box>,
  li: ({ children }) => <Typography variant="body1" component="li">{children}</Typography>,
  blockquote: ({ children }) => <Box component="blockquote" sx={{ m: 0, mb: 1, pl: 1.5, borderLeft: 2, borderColor: "divider", color: "text.secondary" }}>{children}</Box>,
  code: ({ children }) => <Box component="code" sx={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: "0.875em", bgcolor: "action.hover", px: 0.5, borderRadius: 0.5 }}>{children}</Box>,
  pre: ({ children }) => (
    <Box component="pre" sx={{ m: 0, mb: 1, p: 1.5, overflowX: "auto", borderRadius: 1, bgcolor: "action.hover", "& code": { bgcolor: "transparent", p: 0 } }}>{children}</Box>
  ),
  table: ({ children }) => <Table size="small" sx={{ mb: 1.5 }}>{children}</Table>,
  thead: ({ children }) => <TableHead>{children}</TableHead>,
  tbody: ({ children }) => <TableBody>{children}</TableBody>,
  tr: ({ children }) => <TableRow>{children}</TableRow>,
  th: ({ children }) => <TableCell component="th">{children}</TableCell>,
  td: ({ children }) => <TableCell>{children}</TableCell>,
};
