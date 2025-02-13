import useSWR from "swr";
import { useEffect, useMemo } from "react";
import { useLockFn } from "ahooks";
import { useTranslation } from "react-i18next";
import { Box, Button, ButtonGroup, Paper } from "@mui/material";
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

  return (
    <BasePage
      full
      contentStyle={{ height: "100%" }}
      title={t("Proxy Groups")}
      header={
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          justifyContent="center"
          width="100%"
        >
          <ButtonGroup size="medium">
            {modeList.map((mode) => (
              <Button
                key={mode}
                variant={"outlined"}
                onClick={() => onChangeMode(mode)}
                sx={{
                  textTransform: "capitalize",
                  height: "40px",
                  padding: "0 37.5px",
                  border: "1px solid #00000085",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#1D1B20",
                }}
              >
                {t(mode)}
              </Button>
            ))}
          </ButtonGroup>
          <ProviderButton />
        </Box>
      }
    >
      <ProxyGroups mode={curMode!} />
    </BasePage>
  );
};

export default ProxyPage;
