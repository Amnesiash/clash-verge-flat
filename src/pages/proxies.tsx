import useSWR from "swr";
import { useEffect, useMemo } from "react";
import { useLockFn } from "ahooks";
import { useTranslation } from "react-i18next";
import { Box, Button } from "@mui/material";
import {
  closeAllConnections,
  getClashConfig,
  updateConfigs,
} from "@/services/api";
import { patchClashConfig } from "@/services/cmds";
import { useVerge } from "@/hooks/use-verge";
import { BasePage } from "@/components/base";
import { ProxyGroups } from "@/components/proxy/proxy-groups";
import { ProviderButton } from "@/components/proxy/provider-button";

const ProxyPage = () => {
  const { t } = useTranslation();

  const { data: clashConfig, mutate: mutateClash } = useSWR(
    "getClashConfig",
    getClashConfig
  );

  const { verge } = useVerge();

  const modeList = useMemo(() => {
    if (verge?.clash_core?.includes("clash-meta")) {
      return ["rule", "global", "direct"];
    }
    return ["rule", "global", "direct", "script"];
  }, [verge?.clash_core]);

  const curMode = clashConfig?.mode?.toLowerCase();

  const onChangeMode = useLockFn(async (mode: string) => {
    // 断开连接
    if (mode !== curMode && verge?.auto_close_connection) {
      closeAllConnections();
    }
    await updateConfigs({ mode });
    await patchClashConfig({ mode });
    mutateClash();
  });

  useEffect(() => {
    if (curMode && !modeList.includes(curMode)) {
      onChangeMode("rule");
    }
  }, [curMode]);

  //Buttongroup style
  const boxstyle = {
    borderRadius: "6px",
    boxShadow:
      "0px 0px 2px 0px rgba(0, 0, 0, 0.05) inset, 0px 0px 4px 0px rgba(0, 0, 0, 0.05) inset, 0px 0px 2px 0px rgba(0, 0, 0, 0.05) inset",
    padding: "1px",
    backgroundColor: "rgba(0, 0, 0, 0.01)",
  };
  const btstylebase = {
    textTransform: "capitalize",
    borderRadius: "5px",
    padding: "0 16px",
    color: "rgba(0, 0, 0, 0.85)",
    fontSize: "13px",
    height: "21px",
  };

  return (
    <BasePage
      full
      contentStyle={{ height: "100%" }}
      title={t("Proxy Groups")}
      header={
        <Box display="flex" alignItems="center" gap={1}>
          <ProviderButton />
          <Box sx={boxstyle}>
            {modeList.map((mode) => (
              <Button
                key={mode}
                variant={mode === curMode ? "contained" : "outlined"}
                onClick={() => onChangeMode(mode)}
                sx={{
                  ...btstylebase,
                  backgroundColor: mode === curMode ? "#ffffff" : "#transpant",
                  border: mode === curMode ? "0.5px solid #000" : "none",
                }}
              >
                {t(mode)}
              </Button>
            ))}
          </Box>
        </Box>
      }
    >
      <ProxyGroups mode={curMode!} />
    </BasePage>
  );
};

export default ProxyPage;
