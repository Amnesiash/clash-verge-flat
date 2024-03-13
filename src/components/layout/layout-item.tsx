import {
  alpha,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import { useVerge } from "@/hooks/use-verge";
interface Props {
  to: string;
  children: string;
  icon: React.ReactNode[];
}
export const LayoutItem = (props: Props) => {
  const { to, children, icon } = props;
  const { verge } = useVerge();
  const { menu_icon } = verge ?? {};
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });
  const navigate = useNavigate();

  return (
    <ListItem sx={{ py: 0.5, mx: "auto", padding: 0 }}>
      <ListItemButton
        selected={!!match}
        sx={[
          {
            borderRadius: "5px",
            height: "28px",
            margin: "0 0.625rem",
            padding: "0px 8px 0px 4px",
            marginRight: 1.25,
            "& .MuiListItemText-primary": {
              color: "rgba(0, 0, 0, 0.85)",
              fontSize: "13px",
              lineHeight: "16px",
            },
          },
          ({ palette: { mode, primary } }) => {
            const bgcolor =
              mode === "light" ? "#0a82ff" : alpha(primary.main, 0.35);
            const color = mode === "light" ? "#1f1f1f" : "#ffffff";

            return {
              "&.Mui-selected": { bgcolor },
              "&.Mui-selected:hover": { bgcolor },
              "&.Mui-selected .MuiListItemText-primary": { color: "#ffffff" },
            };
          },
        ]}
        onClick={() => navigate(to)}
      >
        {/* {(menu_icon === "monochrome" || !menu_icon) && (
          <ListItemIcon sx={{ color: "text.primary", marginLeft: "4px" }}>
            {icon[0]}
          </ListItemIcon>
        )}
        {menu_icon === "colorful" && } */}
        <ListItemIcon sx={{ minWidth: "24px", marginRight: "2px" }}>
          {icon[1]}
        </ListItemIcon>
        <ListItemText primary={children} />
      </ListItemButton>
    </ListItem>
  );
};
