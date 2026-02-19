import { useState } from "react";

const CORAL = "#FF5A3D";
const CORAL_GRADIENT_END = "#FF7A5C";
const NAVY = "#1B2340";
const LIGHT_BG = "#F7F7FA";
const CARD_BG = "#FFFFFF";
const GRAY = "#8E8E93";
const LIGHT_GRAY = "#E5E5EA";
const GREEN = "#34C759";
const MINT = "#E8FAF0";

const font = "'SF Pro Display', -apple-system, BlinkMacSystemFont, system-ui, sans-serif";
const fontText = "'SF Pro Text', -apple-system, BlinkMacSystemFont, system-ui, sans-serif";

/* ───── iPhone Frame ───── */
const IPhoneFrame = ({ children }) => (
  <div style={{
    width: 320,
    height: 654,
    background: "#000",
    borderRadius: 46,
    padding: 3,
    position: "relative",
    boxShadow: "0 25px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)",
    flexShrink: 0,
  }}>
    {/* Side button details */}
    <div style={{ position: "absolute", right: -2, top: 140, width: 3, height: 28, background: "#222", borderRadius: "0 2px 2px 0" }} />
    <div style={{ position: "absolute", left: -2, top: 120, width: 3, height: 22, background: "#222", borderRadius: "2px 0 0 2px" }} />
    <div style={{ position: "absolute", left: -2, top: 155, width: 3, height: 40, background: "#222", borderRadius: "2px 0 0 2px" }} />
    <div style={{ position: "absolute", left: -2, top: 200, width: 3, height: 40, background: "#222", borderRadius: "2px 0 0 2px" }} />

    <div style={{
      width: "100%",
      height: "100%",
      background: LIGHT_BG,
      borderRadius: 43,
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Status Bar */}
      <div style={{
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 26px",
        position: "relative",
        zIndex: 10,
        background: CARD_BG,
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: NAVY, fontFamily: font }}>9:41</span>
        <div style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 110,
          height: 30,
          background: "#000",
          borderRadius: "0 0 18px 18px",
        }} />
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <svg width="15" height="11" viewBox="0 0 14 10" fill="none"><rect x="0" y="4" width="2.5" height="6" rx="0.5" fill={NAVY}/><rect x="3.5" y="2.5" width="2.5" height="7.5" rx="0.5" fill={NAVY}/><rect x="7" y="1" width="2.5" height="9" rx="0.5" fill={NAVY}/><rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill={NAVY}/></svg>
          <svg width="14" height="11" viewBox="0 0 13 10" fill="none"><path d="M6.5 2C8.5 2 10.2 2.8 11.4 4.1L12.5 3C11 1.4 8.9.5 6.5.5S2 1.4.5 3L1.6 4.1C2.8 2.8 4.5 2 6.5 2Z" fill={NAVY}/><path d="M6.5 5C7.9 5 9.1 5.5 10 6.4L11.1 5.3C9.9 4.1 8.3 3.5 6.5 3.5S3.1 4.1 1.9 5.3L3 6.4C3.9 5.5 5.1 5 6.5 5Z" fill={NAVY}/><circle cx="6.5" cy="8.5" r="1.5" fill={NAVY}/></svg>
          <div style={{ width: 22, height: 10, border: `1.5px solid rgba(27,35,64,0.45)`, borderRadius: 3, position: "relative", marginLeft: 2 }}>
            <div style={{ position: "absolute", top: 1.5, left: 1.5, width: 15, height: 5, background: NAVY, borderRadius: 1 }} />
            <div style={{ position: "absolute", right: -4, top: 2.5, width: 2, height: 4, background: "rgba(27,35,64,0.25)", borderRadius: "0 1px 1px 0" }} />
          </div>
        </div>
      </div>

      {children}

      {/* Home Indicator */}
      <div style={{
        position: "absolute",
        bottom: 7,
        left: "50%",
        transform: "translateX(-50%)",
        width: 110,
        height: 4,
        background: "rgba(0,0,0,0.18)",
        borderRadius: 2,
        zIndex: 20,
      }} />
    </div>
  </div>
);

/* ───── Round-Up Screen Content ───── */
const RoundUpScreen = () => {
  const [activeTab, setActiveTab] = useState("roundup");

  const recentTransactions = [
    { merchant: "Woolworths", category: "Groceries", roundUp: "+$2.15", original: "$47.85", rounded: "$50" },
    { merchant: "7-Eleven", category: "Fuel", roundUp: "+$1.40", original: "$63.60", rounded: "$65" },
    { merchant: "The Coffee Club", category: "Cafe", roundUp: "+$0.40", original: "$4.60", rounded: "$5" },
    { merchant: "Uber Eats", category: "Food Delivery", roundUp: "+$3.70", original: "$31.30", rounded: "$35" },
    { merchant: "Coles", category: "Groceries", roundUp: "+$1.88", original: "$53.12", rounded: "$55" },
  ];

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="1" y="1" width="7" height="7" rx="1.5" stroke={active ? CORAL : GRAY} strokeWidth="1.5" fill={active ? CORAL+"20" : "none"}/>
        <rect x="12" y="1" width="7" height="7" rx="1.5" stroke={active ? CORAL : GRAY} strokeWidth="1.5" fill={active ? CORAL+"20" : "none"}/>
        <rect x="1" y="12" width="7" height="7" rx="1.5" stroke={active ? CORAL : GRAY} strokeWidth="1.5" fill={active ? CORAL+"20" : "none"}/>
        <rect x="12" y="12" width="7" height="7" rx="1.5" stroke={active ? CORAL : GRAY} strokeWidth="1.5" fill={active ? CORAL+"20" : "none"}/>
      </svg>
    )},
    { id: "properties", label: "Properties", icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 10L10 3.5L17 10" stroke={active ? CORAL : GRAY} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 8.5V16.5C5 17.05 5.45 17.5 6 17.5H8.5V13H11.5V17.5H14C14.55 17.5 15 17.05 15 16.5V8.5" stroke={active ? CORAL : GRAY} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { id: "applications", label: "Applications", icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="2" width="14" height="16" rx="2" stroke={active ? CORAL : GRAY} strokeWidth="1.5"/>
        <line x1="7" y1="6" x2="13" y2="6" stroke={active ? CORAL : GRAY} strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="7" y1="9.5" x2="13" y2="9.5" stroke={active ? CORAL : GRAY} strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="7" y1="13" x2="11" y2="13" stroke={active ? CORAL : GRAY} strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    )},
    { id: "deposit", label: "Deposit Aid", icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 6L3 15C3 16.1 3.9 17 5 17H15C16.1 17 17 16.1 17 15V6" stroke={active ? CORAL : GRAY} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M1 6H19L17 3H3L1 6Z" stroke={active ? CORAL : GRAY} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M10 9V14M10 14L7.5 11.5M10 14L12.5 11.5" stroke={active ? CORAL : GRAY} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { id: "roundup", label: "Round-Up", icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 14L7 8L11 11L17 4" stroke={active ? CORAL : GRAY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 4H17V7" stroke={active ? CORAL : GRAY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100% - 50px)", background: CARD_BG }}>
      {/* Header Bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 18px 12px",
        background: CARD_BG,
        borderBottom: "0.5px solid rgba(0,0,0,0.06)",
      }}>
        <div style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9L9 17" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span style={{ fontSize: 17, fontWeight: 600, color: NAVY, fontFamily: font }}>Round-Up</span>
        <div style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{ width: 24, height: 24, borderRadius: 12, border: `2px solid ${CORAL}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: CORAL }} />
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: "auto", background: LIGHT_BG }}>

        {/* Total Round-Ups Hero Banner */}
        <div style={{
          margin: "14px 16px 0",
          background: `linear-gradient(145deg, ${CORAL} 0%, ${CORAL_GRADIENT_END} 100%)`,
          borderRadius: 16,
          padding: "22px 20px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Subtle decorative circles */}
          <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: 40, background: "rgba(255,255,255,0.08)" }} />
          <div style={{ position: "absolute", bottom: -30, left: -10, width: 60, height: 60, borderRadius: 30, background: "rgba(255,255,255,0.06)" }} />

          <p style={{
            fontSize: 10,
            fontWeight: 700,
            color: "rgba(255,255,255,0.8)",
            fontFamily: fontText,
            letterSpacing: 1.8,
            margin: "0 0 6px",
            textTransform: "uppercase",
          }}>Total Round-Ups</p>
          <p style={{
            fontSize: 42,
            fontWeight: 800,
            color: "#fff",
            fontFamily: font,
            margin: "0 0 4px",
            letterSpacing: -1,
            lineHeight: 1,
          }}>$545.00</p>
          <p style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.75)",
            fontFamily: fontText,
            margin: 0,
            fontWeight: 500,
          }}>Towards your deposit</p>
        </div>

        {/* This Week Card */}
        <div style={{
          margin: "12px 16px 0",
          background: CARD_BG,
          borderRadius: 14,
          padding: "16px 18px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: GRAY, fontFamily: fontText, letterSpacing: 1.2, margin: "0 0 4px", textTransform: "uppercase" }}>This Week</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: NAVY, fontFamily: font, margin: "0 0 3px", letterSpacing: -0.5 }}>$43.85</p>
              <p style={{ fontSize: 11, color: GRAY, fontFamily: fontText, margin: 0 }}>Next debit: Mon, 24 Feb</p>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "6px 10px",
              marginTop: 4,
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: CORAL, fontFamily: fontText }}>View all</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6.5" stroke={CORAL} strokeWidth="1"/>
                <path d="M6 5L8.5 7L6 9" stroke={CORAL} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Settings Row */}
        <div style={{
          margin: "10px 16px 0",
          background: CARD_BG,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        }}>
          {/* Round ups setting */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "13px 18px",
            borderBottom: `0.5px solid ${LIGHT_GRAY}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: `${CORAL}12`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke={CORAL} strokeWidth="1.5"/>
                  <text x="7" y="10" textAnchor="middle" fill={CORAL} fontSize="8" fontWeight="700" fontFamily={font}>$</text>
                </svg>
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: NAVY, fontFamily: fontText }}>Round ups</span>
            </div>
            <div style={{
              padding: "4px 12px",
              background: `${CORAL}0C`,
              borderRadius: 20,
              border: `1px solid ${CORAL}25`,
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: CORAL, fontFamily: fontText }}>Nearest $5</span>
            </div>
          </div>

          {/* Weekly limit setting */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "13px 18px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: `${CORAL}12`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <line x1="2" y1="7" x2="12" y2="7" stroke={CORAL} strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: NAVY, fontFamily: fontText }}>Weekly limit</span>
            </div>
            <div style={{
              padding: "4px 12px",
              background: `${CORAL}0C`,
              borderRadius: 20,
              border: `1px solid ${CORAL}25`,
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: CORAL, fontFamily: fontText }}>No limit</span>
            </div>
          </div>
        </div>

        {/* Recent Round-Ups */}
        <div style={{
          margin: "12px 16px 14px",
          background: CARD_BG,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        }}>
          <div style={{ padding: "14px 18px 8px" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: NAVY, fontFamily: font, margin: 0 }}>Recent Round-Ups</p>
          </div>

          {recentTransactions.map((tx, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 18px",
              borderTop: `0.5px solid ${LIGHT_GRAY}`,
              gap: 10,
            }}>
              {/* Green circle indicator */}
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                background: MINT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 2V10M6 2L3 5M6 2L9 5" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Merchant info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: NAVY, fontFamily: fontText, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.merchant}</p>
                <p style={{ fontSize: 10.5, color: GRAY, fontFamily: fontText, margin: "1px 0 0" }}>{tx.category}</p>
              </div>

              {/* Amount info */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: CORAL, fontFamily: font, margin: 0 }}>{tx.roundUp}</p>
                <p style={{ fontSize: 10, color: GRAY, fontFamily: fontText, margin: "1px 0 0" }}>
                  {tx.original} → {tx.rounded}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-around",
        padding: "8px 4px 22px",
        background: CARD_BG,
        borderTop: "0.5px solid rgba(0,0,0,0.08)",
        flexShrink: 0,
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                cursor: "pointer",
                padding: "2px 6px",
                minWidth: 48,
              }}
            >
              {tab.icon(isActive)}
              <span style={{
                fontSize: 9.5,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? CORAL : GRAY,
                fontFamily: fontText,
                letterSpacing: -0.1,
              }}>{tab.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function RoundUpMockup() {
  return (
    <IPhoneFrame>
      <RoundUpScreen />
    </IPhoneFrame>
  );
}
