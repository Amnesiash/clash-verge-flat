import React, { ReactNode } from "react";
import { Typography, alpha } from "@mui/material";
import { BaseErrorBoundary } from "./base-error-boundary";
import { useCustomTheme } from "@/components/layout/use-custom-theme";

interface Props {
  title?: React.ReactNode; // the page title
  header?: React.ReactNode; // something behind title
  contentStyle?: React.CSSProperties;
  children?: ReactNode;
  full?: boolean;
}

export const BasePage: React.FC<Props> = (props) => {
  const { title, header, contentStyle, full, children } = props;
  const { theme } = useCustomTheme();

  return (
    <BaseErrorBoundary>
      <div className="base-page">
        <header data-tauri-drag-region="true" style={{ userSelect: "none" }}>
          {/* <Typography
            sx={{ fontSize: "20px", fontWeight: "700 " }}
            data-tauri-drag-region="true"
          >
            {title}
          </Typography> */}

          {header}
        </header>

        <div
          className={full ? "base-container no-padding" : "base-container"}
          // style={{ backgroundColor: isDark ? "#1e1f27" : "#ffffff" }}
        >
          <section style={{}}>
            <div className="base-content" style={contentStyle}>
              {children}
            </div>
          </section>
        </div>
      </div>
    </BaseErrorBoundary>
  );
};
