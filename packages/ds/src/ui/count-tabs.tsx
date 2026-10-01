"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

export type CountTabDef = { key: string; label: string; count?: number };

/** Pestañas compactas con contador (Pendientes 22 · Resueltas 18). La activa muestra el contador en insignia. */
export function CountTabs({ tabs, value, onChange, label, prefix, trailing, px = 2 }: {
  tabs: CountTabDef[]; value: string; onChange: (k: string) => void; label: string; prefix?: string; trailing?: ReactNode; px?: number;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px, pt: 1, pb: 0.5 }}>
      {prefix && <Typography variant="body2" color="text.secondary" sx={{ pr: 0.5 }}>{prefix}</Typography>}
      <Tabs
        value={value}
        onChange={(_, k: string) => onChange(k)}
        aria-label={label}
        slotProps={{ indicator: { sx: { display: "none" } } }}
        sx={{ minHeight: 0, "& .MuiTabs-flexContainer": { gap: 0.5 } }}
      >
        {tabs.map((t) => {
          const on = t.key === value;
          return (
            <Tab
              key={t.key}
              value={t.key}
              disableRipple
              label={
                <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
                  {t.label}
                  {t.count != null &&
                    (on ? (
                      <Chip size="small" color="primary" label={t.count} sx={{ height: 18, borderRadius: 10, "& .MuiChip-label": { px: 0.75 } }} />
                    ) : (
                      <Typography component="span" variant="caption" color="text.disabled">{t.count}</Typography>
                    ))}
                </Box>
              }
              sx={(th) => ({
                minHeight: 0, px: 1.25, py: 0.5, borderRadius: 1, color: "text.secondary",
                "&:hover": { bgcolor: "action.hover" },
                "&.Mui-selected": { bgcolor: th.palette.tones.primary.sel, color: "primary.main", fontWeight: 500 },
              })}
            />
          );
        })}
      </Tabs>
      <Box sx={{ flex: 1 }} />
      {trailing}
    </Box>
  );
}
