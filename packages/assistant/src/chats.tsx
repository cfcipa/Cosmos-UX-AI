"use client";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useAui, useAuiState } from "@assistant-ui/react";
import { useEffect, useState, type MouseEvent } from "react";

const SIN_TITULO = "Chat sin título";
const ANCHO_MENU = 35;
const ANCHO_BOTON = 30;

const fecha = (d: Date) => d.toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });

/** Sin título generado, el chat se llama como su primera pregunta. */
function primeraPregunta(messages: readonly { role: string; content: readonly { type: string; text?: string }[] }[]) {
  const primera = messages.find((m) => m.role === "user");
  return primera ? primera.content.map((p) => (p.type === "text" ? p.text ?? "" : "")).join(" ").trim() : "";
}

/** El chat actual y el menú de chats anteriores con buscador (`threads` de assistant-ui). */
export function SelectorChats() {
  const aui = useAui();
  const titulo = useAuiState((s) => s.threadListItem.title || primeraPregunta(s.thread.messages));
  const actual = useAuiState((s) => s.threads.mainThreadId);
  const ids = useAuiState((s) => s.threads.threadIds);
  const items = useAuiState((s) => s.threads.threadItems);
  const [ancla, setAncla] = useState<HTMLElement | null>(null);
  const [consulta, setConsulta] = useState("");
  const q = consulta.trim().toLowerCase();
  const porId = new Map(items.map((i) => [i.id, i]));
  const visibles = ids.filter((id) => !q || (porId.get(id)?.title ?? "").toLowerCase().includes(q));
  return (
    <>
      <Button
        color="inherit"
        size="small"
        endIcon={<KeyboardArrowDownIcon fontSize="small" />}
        aria-haspopup="menu"
        aria-expanded={ancla !== null}
        onClick={(e: MouseEvent<HTMLElement>) => setAncla(e.currentTarget)}
        sx={(t) => ({ minWidth: 0, maxWidth: t.spacing(ANCHO_BOTON), textTransform: "none", "&[aria-expanded=\"true\"]": { bgcolor: "action.hover" } })}
      >
        <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{titulo || SIN_TITULO}</Box>
      </Button>
      <Menu
        anchorEl={ancla}
        open={ancla !== null}
        onClose={() => setAncla(null)}
        autoFocus={false}
        slotProps={{
          paper: { sx: (t) => ({ width: t.spacing(ANCHO_MENU) }) },
          transition: { onEntered: (node) => node.querySelector<HTMLInputElement>("input")?.focus(), onExited: () => setConsulta("") },
        }}
      >
        <Box sx={{ px: 1.5, pt: 0.5, pb: 1 }} onKeyDown={(e) => { if (e.key !== "Escape" && e.key !== "ArrowDown") e.stopPropagation(); }}>
          <TextField
            fullWidth
            size="small"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            placeholder="Buscar chats anteriores"
            slotProps={{
              htmlInput: { "aria-label": "Buscar chats anteriores" },
              input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> },
            }}
          />
        </Box>
        {visibles.map((id) => {
          const item = porId.get(id);
          return (
            <MenuItem key={id} selected={id === actual} aria-current={id === actual} onClick={() => { setAncla(null); aui.threads.switchToThread(id); }}>
              <ListItemText
                primary={item?.title || SIN_TITULO}
                secondary={item?.lastMessageAt ? fecha(item.lastMessageAt) : undefined}
                slotProps={{ primary: { noWrap: true }, secondary: { variant: "caption", sx: { fontVariantNumeric: "tabular-nums" } } }}
              />
            </MenuItem>
          );
        })}
        {visibles.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 0.75 }}>{ids.length ? "Ningún chat coincide." : "Aún no hay chats anteriores."}</Typography>
        ) : null}
      </Menu>
    </>
  );
}

/** Nuevo chat y «Más opciones» (copiar el ID del chat). */
export function AccionesChat() {
  const aui = useAui();
  const actual = useAuiState((s) => s.threads.mainThreadId);
  const [ancla, setAncla] = useState<HTMLElement | null>(null);
  const [copiado, setCopiado] = useState(false);
  const copiar = () => {
    setAncla(null);
    void navigator.clipboard?.writeText(actual).catch(() => undefined);
    setCopiado(true);
  };
  return (
    <>
      <Tooltip title="Nuevo chat">
        <IconButton size="small" aria-label="Nuevo chat" onClick={() => aui.threads.switchToNewThread()}><AddCommentOutlinedIcon fontSize="small" /></IconButton>
      </Tooltip>
      <Tooltip title="Más opciones">
        <IconButton size="small" aria-label="Más opciones" aria-haspopup="menu" aria-expanded={ancla !== null} onClick={(e) => setAncla(e.currentTarget)}><MoreVertIcon fontSize="small" /></IconButton>
      </Tooltip>
      <Menu anchorEl={ancla} open={ancla !== null} onClose={() => setAncla(null)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}>
        <MenuItem onClick={copiar}><ListItemIcon><ContentCopyIcon fontSize="small" /></ListItemIcon>Copiar ID del chat</MenuItem>
      </Menu>
      <Snackbar open={copiado} autoHideDuration={3200} onClose={() => setCopiado(false)} message="ID del chat copiado." anchorOrigin={{ vertical: "bottom", horizontal: "center" }} sx={{ position: "absolute" }} />
    </>
  );
}

const LARGO_TITULO = 60;

/** Los chats en memoria no generan título: se nombran con su primera pregunta (`rename` de assistant-ui). Con adaptador, lo hace `generateTitle`. */
export function TituloDelChat() {
  const aui = useAui();
  const conTitulo = useAuiState((s) => Boolean(s.threadListItem.title));
  // Un chat nuevo no se puede renombrar hasta que el primer mensaje lo vuelve regular.
  const regular = useAuiState((s) => s.threadListItem.status === "regular");
  const primera = useAuiState((s) => primeraPregunta(s.thread.messages));
  useEffect(() => {
    if (regular && !conTitulo && primera) aui.threadListItem.rename(primera.slice(0, LARGO_TITULO));
  }, [aui, regular, conTitulo, primera]);
  return null;
}
