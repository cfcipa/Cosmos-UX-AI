import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/DescriptionOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FilterListIcon from "@mui/icons-material/FilterList";
import HistoryIcon from "@mui/icons-material/History";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ReplyIcon from "@mui/icons-material/Reply";
import SearchIcon from "@mui/icons-material/Search";
import UndoIcon from "@mui/icons-material/Undo";
import WalletIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import type { SvgIconProps } from "@mui/material/SvgIcon";

/** Nombres de ícono (los de Lucide del diseño) → ícono de MUI. Los módulos los nombran en su definición. */
const ICONOS = {
  plus: AddIcon,
  "arrow-left": ArrowBackIcon,
  check: CheckIcon,
  "circle-check": CheckCircleIcon,
  circle: RadioButtonUncheckedIcon,
  "chevron-left": ChevronLeftIcon,
  "chevron-right": ChevronRightIcon,
  "chevron-up": ExpandLessIcon,
  x: CloseIcon,
  "file-text": DescriptionIcon,
  "list-filter": FilterListIcon,
  history: HistoryIcon,
  info: InfoIcon,
  reply: ReplyIcon,
  search: SearchIcon,
  "undo-2": UndoIcon,
  wallet: WalletIcon,
} as const;

export type IconName = keyof typeof ICONOS;

export const esIcono = (n: string): n is IconName => n in ICONOS;

/** Ícono por nombre; un nombre desconocido cae en "info". */
export function Icon({ name, ...props }: { name: string } & SvgIconProps) {
  const Cmp = esIcono(name) ? ICONOS[name] : InfoIcon;
  return <Cmp {...props} />;
}
