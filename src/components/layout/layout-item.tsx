import {
  alpha,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import { useVerge } from "@/hooks/use-verge";
import { round, size } from "lodash-es";
interface Props {
  to: string;
  children: string;
  icon: React.ReactNode[];
}
export const LayoutItem = (props: Props) => {
  const { to, children, icon } = props;
  const { verge } = useVerge();
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });
  const navigate = useNavigate();

  return (
    <ListItem
      sx={{
        padding: "0px",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 1.5,
      }}
    >
      <ListItemButton
        selected={!!match}
        sx={[
          {
            padding: "4px 16px",
            borderRadius: 99,
          },
          ({ palette: { mode, primary } }) => {
            const bgcolor =
              mode === "light"
                ? alpha(primary.main, 0.15)
                : alpha(primary.main, 0.35);
            const color = mode === "light" ? "#1f1f1f" : "#ffffff";

            return {
              "&.Mui-selected": { bgcolor },
              "&.Mui-selected:hover": { bgcolor },
              "&.Mui-selected .MuiListItemText-primary": { color },
            };
          },
        ]}
        onClick={() => navigate(to)}
      >
        {icon[0]}
      </ListItemButton>
      <ListItemText
        disableTypography={true}
        sx={{
          fontSize: "12px",
          letterSpacing: "0.5px",
          // fontWeight: "700"
        }}
        primary={children}
      />
      <></>
    </ListItem>
  );
};
