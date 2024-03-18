import { useEffect, useState } from "react";
import { useLockFn } from "ahooks";
import {
  CheckCircleOutlineRounded,
  DisplaySettings,
  DriveEtaSharp,
  Padding,
} from "@mui/icons-material";
import {
  alpha,
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  SxProps,
  Theme,
  Divider,
  Radio,
} from "@mui/material";
import { BaseLoading } from "@/components/base";
import delayManager from "@/services/delay";
import { useVerge } from "@/hooks/use-verge";
import { values } from "lodash-es";

interface Props {
  groupName: string;
  proxy: IProxyItem;
  selected: boolean;
  showType?: boolean;
  sx?: SxProps<Theme>;
  onClick?: (name: string) => void;
}

const Widget = styled(Box)(() => ({
  padding: "3px 6px",
  fontSize: 12,
  borderRadius: "4px",
}));

const TypeBox = styled(Box)(({ theme }) => ({
  display: "inline-block",
  border: "1px solid #ccc",
  borderColor: "#00000040",
  color: "#00000080",
  borderRadius: "4px",
  fontSize: 10,
  marginRight: "4px",
  padding: "1px 4px",
  lineHeight: "13px",
}));

export const ProxyItem = (props: Props) => {
  const { groupName, proxy, selected, showType = true, sx, onClick } = props;

  // -1/<=0 为 不显示
  // -2 为 loading
  const [delay, setDelay] = useState(-1);
  const { verge } = useVerge();
  const timeout = verge?.default_latency_timeout || 10000;
  useEffect(() => {
    delayManager.setListener(proxy.name, groupName, setDelay);

    return () => {
      delayManager.removeListener(proxy.name, groupName);
    };
  }, [proxy.name, groupName]);

  useEffect(() => {
    if (!proxy) return;
    setDelay(delayManager.getDelayFix(proxy, groupName));
  }, [proxy]);

  const onDelay = useLockFn(async () => {
    setDelay(-2);
    setDelay(await delayManager.checkDelay(proxy.name, groupName, timeout));
  });

  return (
    <Box sx={{ margin: "0 20px" }}>
      <Box sx={{ margin: "0 12px 0 12px" }}>
        <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.04)" }}></Divider>
        <ListItemButton
          dense
          disableRipple={true}
          disableTouchRipple={true}
          selected={selected}
          onClick={() => onClick?.(proxy.name)}
          sx={[
            { padding: 0, backgroundColor: "transparent", height: "53px" },
            ({ palette: { mode, primary } }) => {
              // const bgcolor = mode === "light" ? "#ffffff" : "#24252f";
              // const selectColor = mode === "light" ? primary.main : primary.light;
              const showDelay = delay > 0;
              return {
                "&:hover .the-check": {
                  display: !showDelay ? "block" : "none",
                },
                "&:hover .the-delay": { display: showDelay ? "block" : "none" },
                "&:hover .the-icon": { display: "none" },
                "&.Mui-selected": {
                  bgcolor: "transparent",
                },
                "&.Mui-selected:hover": {
                  bgcolor: "transparent",
                },
                "&:hover": {
                  bgcolor: "transparent",
                },
              };
            },
          ]}
        >
          <Radio
            checked={selected}
            value={proxy.name}
            onChange={() => onClick?.(proxy.name)}
            disableRipple={true}
            size={"small"}
            sx={{ marginLeft: "-12px" }}
          ></Radio>
          <ListItemText
            title={proxy.name}
            secondary={
              <>
                <Box
                  sx={{
                    display: "inline-block",
                    marginRight: "8px",
                    fontSize: "13px",
                    lineHeight: "16px",
                    color: "text.primary",
                  }}
                >
                  {proxy.name}
                  {showType && proxy.now && ` - ${proxy.now}`}
                </Box>
                <Box>
                  {showType && !!proxy.provider && (
                    <TypeBox component="span">{proxy.provider}</TypeBox>
                  )}
                  {showType && <TypeBox component="span">{proxy.type}</TypeBox>}
                  {showType && proxy.udp && (
                    <TypeBox component="span">UDP</TypeBox>
                  )}
                  {showType && proxy.xudp && (
                    <TypeBox component="span">XUDP</TypeBox>
                  )}
                  {showType && proxy.tfo && (
                    <TypeBox component="span">TFO</TypeBox>
                  )}
                </Box>
              </>
            }
          />

          <ListItemIcon
            sx={{ justifyContent: "flex-end", color: "primary.main" }}
          >
            {delay === -2 && (
              <Widget>
                <BaseLoading />
              </Widget>
            )}

            {!proxy.provider && delay !== -2 && (
              // provider的节点不支持检测
              <Widget
                className="the-check"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelay();
                }}
                sx={({ palette }) => ({
                  display: "none", // hover才显示
                  ":hover": { bgcolor: alpha(palette.primary.main, 0.15) },
                })}
              >
                Check
              </Widget>
            )}

            {delay > 0 && (
              // 显示延迟
              <Widget
                className="the-delay"
                onClick={(e) => {
                  if (proxy.provider) return;
                  e.preventDefault();
                  e.stopPropagation();
                  onDelay();
                }}
                color={delayManager.formatDelayColor(delay, timeout)}
                sx={({ palette }) =>
                  !proxy.provider
                    ? {
                        ":hover": {
                          bgcolor: alpha(palette.primary.main, 0.15),
                        },
                      }
                    : {}
                }
              >
                {delayManager.formatDelay(delay, timeout)}
              </Widget>
            )}

            {delay !== -2 && delay <= 0 && selected && (
              // 展示已选择的icon
              <CheckCircleOutlineRounded
                className="the-icon"
                sx={{ fontSize: 16 }}
              />
            )}
          </ListItemIcon>
        </ListItemButton>
      </Box>
    </Box>
  );
};
