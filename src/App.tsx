import React, { useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart, Legend } from "recharts";

// ─── Harvard Color Palette ───────────────────────────────────────────────────
const H = {
  crimson:      "#A51C30",  // Harvard Crimson (primary)
  crimsonDark:  "#8B0000",  // Deep crimson for hover/accent
  crimsonLight: "#C84B5A",  // Lighter crimson for highlights
  gold:         "#C9A84C",  // Harvard Gold
  goldLight:    "#E8C97A",  // Light gold
  cream:        "#FFFFFF",  // Flat white (background)
  parchment:    "#F5F5F5",  // Off-white
  tan:          "#E0E0E0",  // Light grey for borders
  charcoal:     "#1A1A1A",  // Near-black text
  slate:        "#4A4A4A",  // Secondary text
  muted:        "#7A7060",  // Muted/tertiary text
  white:        "#FFFFFF",
  green:        "#2D6A4F",  // Success green (muted to fit palette)
  red:          "#A51C30",  // Use crimson for "bad"
  blue:         "#1D4E89",  // Deep navy for contrast
  navy:         "#0D2B4E",  // Darkest navy
};

const data = [
  { state: "Alabama", Y: 200, price: 2.19, income: 13, temp: 66 },
  { state: "Arizona", Y: 150, price: 1.99, income: 17, temp: 62 },
  { state: "Arkansas", Y: 237, price: 1.93, income: 11, temp: 63 },
  { state: "California", Y: 135, price: 2.59, income: 25, temp: 56 },
  { state: "Colorado", Y: 121, price: 2.29, income: 19, temp: 52 },
  { state: "Connecticut", Y: 118, price: 2.49, income: 27, temp: 50 },
  { state: "Delaware", Y: 217, price: 1.99, income: 28, temp: 52 },
  { state: "Florida", Y: 242, price: 2.29, income: 18, temp: 72 },
  { state: "Georgia", Y: 295, price: 1.89, income: 14, temp: 64 },
  { state: "Idaho", Y: 85, price: 2.39, income: 16, temp: 46 },
  { state: "Illinois", Y: 114, price: 2.35, income: 24, temp: 52 },
  { state: "Indiana", Y: 184, price: 2.19, income: 20, temp: 52 },
  { state: "Iowa", Y: 104, price: 2.21, income: 16, temp: 50 },
  { state: "Kansas", Y: 143, price: 2.17, income: 17, temp: 56 },
  { state: "Kentucky", Y: 230, price: 2.05, income: 13, temp: 56 },
  { state: "Louisiana", Y: 269, price: 1.97, income: 15, temp: 69 },
  { state: "Maine", Y: 111, price: 2.19, income: 16, temp: 41 },
  { state: "Maryland", Y: 217, price: 2.11, income: 21, temp: 54 },
  { state: "Massachusetts", Y: 114, price: 2.29, income: 22, temp: 47 },
  { state: "Michigan", Y: 108, price: 2.25, income: 21, temp: 47 },
  { state: "Minnesota", Y: 108, price: 2.31, income: 18, temp: 41 },
  { state: "Mississippi", Y: 248, price: 1.98, income: 10, temp: 65 },
  { state: "Missouri", Y: 203, price: 1.94, income: 19, temp: 57 },
  { state: "Montana", Y: 77, price: 2.31, income: 19, temp: 44 },
  { state: "Nebraska", Y: 97, price: 2.28, income: 16, temp: 49 },
  { state: "Nevada", Y: 166, price: 2.19, income: 24, temp: 48 },
  { state: "New Hampshire", Y: 177, price: 2.27, income: 18, temp: 35 },
  { state: "New Jersey", Y: 143, price: 2.31, income: 24, temp: 54 },
  { state: "New Mexico", Y: 157, price: 2.17, income: 15, temp: 56 },
  { state: "New York", Y: 111, price: 2.43, income: 25, temp: 48 },
  { state: "North Carolina", Y: 330, price: 1.89, income: 13, temp: 59 },
  { state: "North Dakota", Y: 63, price: 2.33, income: 14, temp: 39 },
  { state: "Ohio", Y: 165, price: 2.21, income: 22, temp: 51 },
  { state: "Oklahoma", Y: 184, price: 2.19, income: 16, temp: 82 },
  { state: "Oregon", Y: 68, price: 2.25, income: 19, temp: 51 },
  { state: "Pennsylvania", Y: 121, price: 2.31, income: 20, temp: 50 },
  { state: "Rhode Island", Y: 138, price: 2.23, income: 20, temp: 50 },
  { state: "South Carolina", Y: 237, price: 1.93, income: 12, temp: 65 },
  { state: "South Dakota", Y: 95, price: 2.34, income: 13, temp: 45 },
  { state: "Tennessee", Y: 236, price: 2.19, income: 13, temp: 60 },
  { state: "Texas", Y: 222, price: 2.08, income: 17, temp: 69 },
  { state: "Utah", Y: 100, price: 2.37, income: 16, temp: 50 },
  { state: "Vermont", Y: 64, price: 2.36, income: 16, temp: 44 },
  { state: "Virginia", Y: 270, price: 2.04, income: 16, temp: 58 },
  { state: "Washington", Y: 77, price: 2.19, income: 20, temp: 49 },
  { state: "West Virginia", Y: 144, price: 2.11, income: 15, temp: 55 },
  { state: "Wisconsin", Y: 97, price: 2.38, income: 19, temp: 46 },
  { state: "Wyoming", Y: 102, price: 2.31, income: 19, temp: 46 },
];

const coeffs = { b0: 514.267, b1: -242.971, b2: 1.224, b3: 2.931 };
const n = data.length;
const Ymean = data.reduce((s, d) => s + d.Y, 0) / n;
const SST = data.reduce((s, d) => s + (d.Y - Ymean) ** 2, 0);
const fitted = data.map((d) => ({
  ...d,
  Yhat: coeffs.b0 + coeffs.b1 * d.price + coeffs.b2 * d.income + coeffs.b3 * d.temp,
}));
const SSE = fitted.reduce((s, d) => s + (d.Y - d.Yhat) ** 2, 0);
const SSR = SST - SSE;

const steps = [
  { id: 0, title: "The Goal",              subtitle: "What are we trying to do?",           color: H.crimson },
  { id: 1, title: "Step 1: The Data",      subtitle: "48 U.S. states, 4 variables",         color: H.blue },
  { id: 2, title: "Step 2: The Model",     subtitle: "Writing the regression equation",     color: H.gold },
  { id: 3, title: "Step 3: OLS Estimation",subtitle: "How coefficients are found",          color: H.green },
  { id: 4, title: "Step 4: The Results",   subtitle: "Interpreting each coefficient",       color: H.crimson },
  { id: 5, title: "Step 5: Model Fit",     subtitle: "R², F-test, and significance",        color: H.navy },
  { id: 6, title: "Step 6: Price Elasticity", subtitle: "Converting coefficients to elasticity", color: H.blue },
  { id: 7, title: "Step 7: Omitted Variable Bias", subtitle: "What happens when we drop variables", color: H.crimsonDark },
];

const CoeffCard = ({ label, value, se, tStat, color, interpretation }: { label: string; value: string; se: string; tStat: string; color: string; interpretation: string }) => {
  const tNum = parseFloat(tStat);
  const sig = Math.abs(tNum) > 2;
  return (
    <div style={{ background: H.white, border: `1px solid ${color}40`, borderLeft: `4px solid ${color}`, borderRadius: 8, padding: "16px 20px", marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: color, fontFamily: "monospace", fontSize: 12, fontWeight: 700, marginBottom: 4, letterSpacing: 1 }}>{label}</div>
          <div style={{ color: H.charcoal, fontSize: 24, fontWeight: 700 }}>{value}</div>
        </div>
        <div style={{ textAlign: "right", fontSize: 12, color: H.muted }}>
          <div>SE: {se}</div>
          <div style={{ marginTop: 2 }}>t: <span style={{ color: sig ? H.green : H.crimson, fontWeight: 700 }}>{tStat}</span></div>
          <div style={{ marginTop: 2, fontSize: 10, color: sig ? H.green : H.crimson }}>{sig ? "✓ Significant" : "✗ Not significant"}</div>
        </div>
      </div>
      <div style={{ color: H.slate, fontSize: 13, marginTop: 10, lineHeight: 1.6, borderTop: `1px solid ${H.tan}`, paddingTop: 10 }}>{interpretation}</div>
    </div>
  );
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div style={{ background: H.white, border: `1px solid ${H.tan}`, borderRadius: 6, padding: "10px 14px", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>
        <div style={{ color: H.crimson, fontWeight: 700, marginBottom: 4 }}>{d.state}</div>
        <div style={{ color: H.charcoal }}>Actual: <strong>{d.Y}</strong></div>
        {d.Yhat && <div style={{ color: H.blue }}>Fitted: <strong>{d.Yhat?.toFixed(1)}</strong></div>}
      </div>
    );
  }
  return null;
};

const InfoBox = ({ accentColor, label, children }: { accentColor: string; label?: string; children: React.ReactNode }) => (
  <div style={{ background: `${accentColor}08`, border: `1px solid ${accentColor}35`, borderRadius: 10, padding: "18px 22px", marginBottom: 20 }}>
    {label && <div style={{ color: accentColor, fontSize: 11, fontFamily: "monospace", letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>{label}</div>}
    {children}
  </div>
);

export default function App() {
  const [step, setStep] = useState(0);
  const [xVar, setXVar] = useState<"price" | "income" | "temp">("price");
  const currentStep = steps[step];
  const scatterData = data.map((d) => ({ ...d, x: d[xVar], y: d.Y }));

  const xVarMeta = {
    price:  { label: "vs. Price",       color: H.crimson, axisLabel: "6-Pack Price ($)" },
    income: { label: "vs. Income",      color: H.gold,    axisLabel: "Income ($/capita 000s)" },
    temp:   { label: "vs. Temperature", color: H.blue,    axisLabel: "Mean Temp (°F)" },
  };

  return (
    <div style={{ minHeight: "100vh", background: H.cream, color: H.charcoal, fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* Header */}
      <div style={{ background: H.crimson, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(165,28,48,0.4)" }}>
        <div style={{ padding: "18px 0" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 4 }}>
            Multiple Regression · Step-by-Step
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: H.white, letterSpacing: 0.3 }}>
            Soft Drink Demand Estimation
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ borderLeft: `1px solid rgba(255,255,255,0.3)`, paddingLeft: 16 }}>
            <div style={{ color: H.goldLight, fontSize: 22, fontWeight: 700, fontFamily: "monospace" }}>n = 48</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, letterSpacing: 2 }}>U.S. STATES</div>
          </div>
        </div>
      </div>

      {/* Gold accent bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${H.gold}, ${H.goldLight}, ${H.gold})` }} />

      {/* Step Nav */}
      <div style={{ display: "flex", gap: 4, padding: "14px 32px", background: H.parchment, overflowX: "auto", borderBottom: `1px solid ${H.tan}` }}>
        {steps.map((s) => (
          <button key={s.id} onClick={() => setStep(s.id)} style={{
            padding: "7px 14px", borderRadius: 4, cursor: "pointer", whiteSpace: "nowrap", fontSize: 12, fontWeight: 600,
            fontFamily: "'Georgia', serif",
            border: step === s.id ? `1px solid ${s.color}` : `1px solid transparent`,
            background: step === s.id ? s.color : "transparent",
            color: step === s.id ? H.white : H.muted,
            transition: "all 0.15s",
          }}>
            {s.title.split(":")[0]}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "32px", maxWidth: 1000, margin: "0 auto" }}>
        {/* Step heading */}
        <div style={{ marginBottom: 28, borderBottom: `2px solid ${H.tan}`, paddingBottom: 16 }}>
          <div style={{ color: currentStep.color, fontSize: 11, fontFamily: "monospace", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>{currentStep.subtitle}</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: H.charcoal, margin: 0, fontFamily: "'Georgia', serif" }}>{currentStep.title}</h2>
        </div>

        {/* ── STEP 0: GOAL ── */}
        {step === 0 && (
          <div>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: H.slate, maxWidth: 700, marginBottom: 28 }}>
              We want to understand <em style={{ color: H.charcoal }}>what drives soft drink consumption</em> across U.S. states. Multiple regression lets us isolate the effect of each variable — holding the others constant.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
              {[
                { label: "Outcome (Y)", desc: "Cans per capita per year", icon: "🥤", color: H.crimson },
                { label: "Price (X₁)", desc: "6-pack price in dollars", icon: "💲", color: H.blue },
                { label: "Income (X₂)", desc: "Per-capita income ($000s)", icon: "💰", color: H.gold },
                { label: "Temperature (X₃)", desc: "Mean annual temp (°F)", icon: "🌡️", color: H.green },
              ].map((v) => (
                <div key={v.label} style={{ background: H.white, border: `1px solid ${H.tan}`, borderLeft: `4px solid ${v.color}`, borderRadius: 8, padding: "18px 22px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: 26 }}>{v.icon}</div>
                  <div>
                    <div style={{ color: v.color, fontFamily: "monospace", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>{v.label}</div>
                    <div style={{ color: H.slate, fontSize: 14, marginTop: 3 }}>{v.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <InfoBox accentColor={H.crimson} label="KEY ADVANTAGE OF MULTIPLE REGRESSION">
              <p style={{ margin: 0, color: H.slate, lineHeight: 1.75, fontSize: 14 }}>
                A simple scatter plot of cans vs. price mixes up the effects of income and temperature. Multiple regression <strong style={{ color: H.charcoal }}>controls for all variables simultaneously</strong>, giving us cleaner, unbiased estimates of each variable's true effect.
              </p>
            </InfoBox>
          </div>
        )}

        {/* ── STEP 1: DATA ── */}
        {step === 1 && (
          <div>
            <p style={{ color: H.slate, lineHeight: 1.75, marginBottom: 22, fontSize: 14 }}>
              Explore the raw data. Select a variable to see how it relates to soft drink consumption across the 48 states.
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
              {Object.entries(xVarMeta).map(([key, meta]) => (
                <button key={key} onClick={() => setXVar(key as "price" | "income" | "temp")} style={{
                  padding: "7px 18px", borderRadius: 4, border: `1px solid ${xVar === key ? meta.color : H.tan}`,
                  cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Georgia', serif",
                  background: xVar === key ? meta.color : H.white,
                  color: xVar === key ? H.white : H.muted,
                  transition: "all 0.15s",
                }}>{meta.label}</button>
              ))}
            </div>
            <div style={{ background: H.white, border: `1px solid ${H.tan}`, borderRadius: 8, padding: "20px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke={H.tan} />
                  <XAxis dataKey="x" stroke={H.muted} tick={{ fill: H.muted, fontSize: 11 }}
                    label={{ value: xVarMeta[xVar].axisLabel, position: "insideBottom", offset: -5, fill: H.muted, fontSize: 12 }} />
                  <YAxis dataKey="y" stroke={H.muted} tick={{ fill: H.muted, fontSize: 11 }}
                    label={{ value: "Cans/Capita/Yr", angle: -90, position: "insideLeft", fill: H.muted, fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter data={scatterData} fill={xVarMeta[xVar].color} opacity={0.8} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { label: "Mean Consumption", value: "158.2 cans/yr" },
                { label: "Mean Price", value: "$2.20 / 6-pack" },
                { label: "Sample Size", value: "48 states" },
              ].map((s) => (
                <div key={s.label} style={{ background: H.white, border: `1px solid ${H.tan}`, borderRadius: 8, padding: "14px 18px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ color: H.muted, fontSize: 11, marginBottom: 4, letterSpacing: 1 }}>{s.label}</div>
                  <div style={{ color: H.crimson, fontWeight: 700, fontSize: 16 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: MODEL ── */}
        {step === 2 && (
          <div>
            <p style={{ color: H.slate, lineHeight: 1.75, marginBottom: 24, fontSize: 14 }}>
              A multiple regression model assumes consumption is a <em style={{ color: H.charcoal }}>linear function</em> of all predictors. We write:
            </p>
            <div style={{ background: H.white, border: `2px solid ${H.gold}`, borderRadius: 8, padding: "22px 28px", textAlign: "center", marginBottom: 26, boxShadow: "0 2px 8px rgba(201,168,76,0.15)" }}>
              <div style={{ fontFamily: "monospace", fontSize: 20, color: H.charcoal, letterSpacing: 1 }}>
                Y = β₀ + β₁X₁ + β₂X₂ + β₃X₃ + ε
              </div>
            </div>
            <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
              {[
                { sym: "Y",  desc: "Cans/capita/year — what we're predicting",                    color: H.crimson },
                { sym: "β₀", desc: "Intercept — baseline consumption when all Xs = 0",            color: H.gold },
                { sym: "β₁", desc: "Coefficient on price — effect of a $1 price increase",        color: H.blue },
                { sym: "β₂", desc: "Coefficient on income — effect of $1,000 more income",        color: H.gold },
                { sym: "β₃", desc: "Coefficient on temperature — effect of 1°F warmer",           color: H.green },
                { sym: "ε",  desc: "Error term — everything else we didn't measure",              color: H.muted },
              ].map((r) => (
                <div key={r.sym} style={{ display: "flex", alignItems: "center", gap: 16, background: H.white, border: `1px solid ${H.tan}`, borderRadius: 8, padding: "11px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 18, color: r.color, minWidth: 36, fontWeight: 700 }}>{r.sym}</div>
                  <div style={{ color: H.slate, fontSize: 14 }}>{r.desc}</div>
                </div>
              ))}
            </div>
            <InfoBox accentColor={H.gold} label="KEY ASSUMPTION">
              <p style={{ margin: 0, color: H.slate, fontSize: 14, lineHeight: 1.75 }}>
                Each coefficient measures the effect of that variable <strong style={{ color: H.charcoal }}>holding all other variables constant</strong>. This is what separates multiple regression from simple correlations — we disentangle effects that would otherwise be confounded.
              </p>
            </InfoBox>
          </div>
        )}

        {/* ── STEP 3: OLS ── */}
        {step === 3 && (
          <div>
            <p style={{ color: H.slate, lineHeight: 1.75, marginBottom: 22, fontSize: 14 }}>
              OLS (Ordinary Least Squares) finds the coefficients that <strong style={{ color: H.charcoal }}>minimize the sum of squared residuals</strong> — the vertical distances between actual and predicted values.
            </p>
            <div style={{ background: H.white, border: `2px solid ${H.green}`, borderRadius: 8, padding: "20px 28px", textAlign: "center", marginBottom: 22, boxShadow: "0 2px 6px rgba(45,106,79,0.1)" }}>
              <div style={{ color: H.muted, fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>OLS MINIMIZES</div>
              <div style={{ fontFamily: "monospace", fontSize: 18, color: H.charcoal }}>SSE = Σ(Yᵢ − Ŷᵢ)² → minimum</div>
            </div>
            <div style={{ background: H.white, border: `1px solid ${H.tan}`, borderRadius: 8, padding: "20px 16px", marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ color: H.green, fontSize: 11, fontFamily: "monospace", letterSpacing: 2, marginBottom: 14 }}>ACTUAL vs. FITTED VALUES (first 15 states)</div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={fitted.slice(0, 15)} margin={{ top: 5, right: 20, bottom: 42, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={H.tan} />
                  <XAxis dataKey="state" tick={{ fill: H.muted, fontSize: 9 }} angle={-35} textAnchor="end" />
                  <YAxis tick={{ fill: H.muted, fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: H.white, border: `1px solid ${H.tan}`, borderRadius: 6 }} />
                  <Legend />
                  <Line type="monotone" dataKey="Y" stroke={H.crimson} strokeWidth={2} dot={{ fill: H.crimson, r: 3 }} name="Actual" />
                  <Line type="monotone" dataKey="Yhat" stroke={H.gold} strokeWidth={2} dot={{ fill: H.gold, r: 3 }} strokeDasharray="5 5" name="Fitted" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { label: "SST — Total Variation", value: "213,302", desc: "How much Y varies around its mean", color: H.navy },
                { label: "SSR — Explained",       value: "148,890", desc: "Variation explained by the model",  color: H.green },
                { label: "SSE — Residual",         value: "64,412",  desc: "Variation left unexplained",       color: H.crimson },
              ].map((s) => (
                <div key={s.label} style={{ background: H.white, border: `1px solid ${H.tan}`, borderLeft: `4px solid ${s.color}`, borderRadius: 8, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div style={{ color: s.color, fontSize: 10, fontFamily: "monospace", letterSpacing: 1, marginBottom: 6 }}>{s.label}</div>
                  <div style={{ color: H.charcoal, fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ color: H.muted, fontSize: 12 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 4: RESULTS ── */}
        {step === 4 && (
          <div>
            <div style={{ background: H.white, border: `1px solid ${H.tan}`, borderRadius: 8, padding: "16px 24px", marginBottom: 22, fontFamily: "monospace", fontSize: 15, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <span style={{ color: H.crimson, fontWeight: 700 }}>Ŷ</span> ={" "}
              <span style={{ color: H.gold }}>514.27</span>{" "}
              <span style={{ color: H.crimson }}>− 242.97</span>(Price){" "}
              <span style={{ color: H.gold }}>+ 1.22</span>(Income){" "}
              <span style={{ color: H.green }}>+ 2.93</span>(Temp)
            </div>
            <CoeffCard label="β₀ — Intercept"   value="514.27"   se="113.33" tStat="4.54"  color={H.gold}
              interpretation="Baseline consumption when all predictors are zero. Economically less meaningful on its own, but necessary for the equation to function." />
            <CoeffCard label="β₁ — Price"        value="−242.97"  se="43.53"  tStat="−5.58" color={H.crimson}
              interpretation="A $1 increase in the 6-pack price reduces consumption by ~243 cans per capita per year, holding income and temperature constant. Highly statistically significant." />
            <CoeffCard label="β₂ — Income"       value="+1.22"    se="1.52"   tStat="0.80"  color={H.gold}
              interpretation="Each $1,000 increase in per-capita income adds ~1.22 cans. Effect is small and NOT statistically significant — soft drinks appear largely income-neutral." />
            <CoeffCard label="β₃ — Temperature"  value="+2.93"    se="0.71"   tStat="4.12"  color={H.green}
              interpretation="Each additional °F of mean temperature increases consumption by ~2.93 cans per year. Highly significant — hotter climates drink considerably more soda." />
            <div style={{ background: H.parchment, border: `1px solid ${H.tan}`, borderRadius: 8, padding: "10px 16px", marginTop: 4 }}>
              <div style={{ fontSize: 12, color: H.muted }}>A t-statistic with |t| &gt; ~2.0 indicates statistical significance at the 5% level.</div>
            </div>
          </div>
        )}

        {/* ── STEP 5: MODEL FIT ── */}
        {step === 5 && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div style={{ background: H.white, border: `1px solid ${H.tan}`, borderLeft: `4px solid ${H.crimson}`, borderRadius: 8, padding: "22px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ color: H.crimson, fontSize: 11, fontFamily: "monospace", letterSpacing: 2, marginBottom: 8 }}>R² — COEFFICIENT OF DETERMINATION</div>
                <div style={{ fontSize: 38, fontWeight: 700, color: H.charcoal, marginBottom: 10 }}>0.698</div>
                <p style={{ color: H.slate, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                  The model explains <strong style={{ color: H.charcoal }}>69.8%</strong> of the total variation in soft drink consumption. The remaining 30.2% is unexplained — culture, distribution, preferences, etc.
                </p>
              </div>
              <div style={{ background: H.white, border: `1px solid ${H.tan}`, borderLeft: `4px solid ${H.navy}`, borderRadius: 8, padding: "22px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ color: H.navy, fontSize: 11, fontFamily: "monospace", letterSpacing: 2, marginBottom: 8 }}>F-STATISTIC — OVERALL MODEL TEST</div>
                <div style={{ fontSize: 38, fontWeight: 700, color: H.charcoal, marginBottom: 10 }}>33.90</div>
                <p style={{ color: H.slate, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                  Far exceeds the critical value (~2.84 at 5% with 3 & 44 df). We <strong style={{ color: H.charcoal }}>reject H₀</strong> — the model has genuine explanatory power.
                </p>
              </div>
            </div>
            <div style={{ background: H.white, border: `1px solid ${H.tan}`, borderRadius: 8, padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ color: H.muted, fontSize: 11, fontFamily: "monospace", letterSpacing: 2, marginBottom: 14 }}>VARIANCE DECOMPOSITION: SST = SSR + SSE</div>
              <div style={{ display: "flex", height: 34, borderRadius: 6, overflow: "hidden", marginBottom: 14, border: `1px solid ${H.tan}` }}>
                <div style={{ width: `${(SSR / SST * 100).toFixed(1)}%`, background: `linear-gradient(90deg, ${H.crimson}, ${H.crimsonLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: H.white }}>
                  {(SSR / SST * 100).toFixed(1)}% explained
                </div>
                <div style={{ flex: 1, background: H.parchment, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: H.muted }}>
                  {(SSE / SST * 100).toFixed(1)}% residual
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ color: H.muted, fontSize: 12 }}>Significant at 5%:</div>
                {["Price ✓", "Temp ✓"].map((s) => (
                  <span key={s} style={{ background: `${H.green}15`, color: H.green, border: `1px solid ${H.green}40`, padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s}</span>
                ))}
                {["Income ✗"].map((s) => (
                  <span key={s} style={{ background: `${H.crimson}10`, color: H.crimson, border: `1px solid ${H.crimson}40`, padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 6: ELASTICITY ── */}
        {step === 6 && (
          <div>
            <p style={{ color: H.slate, lineHeight: 1.75, marginBottom: 22, fontSize: 14 }}>
              Coefficients tell us the <em>unit</em> change, but elasticity tells us the <em>percentage</em> change — making it comparable across goods and markets.
            </p>
            <InfoBox accentColor={H.blue} label="ELASTICITY FORMULA">
              <div style={{ fontFamily: "monospace", fontSize: 17, color: H.charcoal, marginBottom: 16 }}>
                E_p = β₁ × (P̄ / Ȳ)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { label: "β₁ (Price coeff)", value: "−242.97" },
                  { label: "P̄ (Mean price)",   value: "$2.20" },
                  { label: "Ȳ (Mean cans)",    value: "158.2" },
                ].map((r) => (
                  <div key={r.label} style={{ background: H.white, borderRadius: 6, padding: "10px 14px", textAlign: "center", border: `1px solid ${H.tan}` }}>
                    <div style={{ color: H.muted, fontSize: 10, marginBottom: 4, letterSpacing: 1 }}>{r.label}</div>
                    <div style={{ color: H.charcoal, fontWeight: 700, fontFamily: "monospace" }}>{r.value}</div>
                  </div>
                ))}
              </div>
            </InfoBox>
            <div style={{ background: H.crimson, borderRadius: 8, padding: "24px", textAlign: "center", marginBottom: 22, boxShadow: "0 4px 12px rgba(165,28,48,0.3)" }}>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginBottom: 8, fontFamily: "monospace" }}>E_p = −242.97 × (2.20 / 158.2)</div>
              <div style={{ fontSize: 48, fontWeight: 700, color: H.white, fontFamily: "monospace" }}>−3.38</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 6 }}>Price Elasticity of Demand</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ background: H.white, border: `1px solid ${H.tan}`, borderLeft: `4px solid ${H.gold}`, borderRadius: 8, padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ color: H.gold, fontWeight: 700, marginBottom: 8, fontSize: 14 }}>What does −3.38 mean?</div>
                <p style={{ color: H.slate, fontSize: 13, lineHeight: 1.75, margin: 0 }}>
                  A <strong style={{ color: H.charcoal }}>1% increase</strong> in price leads to a <strong style={{ color: H.crimson }}>3.38% decrease</strong> in consumption. Demand is highly elastic — consumers are very responsive to price changes.
                </p>
              </div>
              <div style={{ background: H.white, border: `1px solid ${H.tan}`, borderLeft: `4px solid ${H.green}`, borderRadius: 8, padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ color: H.green, fontWeight: 700, marginBottom: 8, fontSize: 14 }}>Economic interpretation</div>
                <p style={{ color: H.slate, fontSize: 13, lineHeight: 1.75, margin: 0 }}>
                  Many substitutes exist (water, juice, etc.), making demand sensitive to price. A retailer raising prices even modestly could lose substantial sales volume.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 7: OMITTED VARIABLE BIAS ── */}
        {step === 7 && (
          <div>
            <p style={{ color: H.slate, lineHeight: 1.75, marginBottom: 22, fontSize: 14 }}>
              Watch what happens to the income coefficient as we drop variables from the model. This illustrates <strong style={{ color: H.charcoal }}>omitted variable bias</strong>.
            </p>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                { model: "Full Model",         eq: "Y = f(Price, Income, Temp)", incomeCoeff: "+1.22",  r2: "0.698", color: H.green,   note: "Correct estimate. Income has a small positive, insignificant effect on consumption." },
                { model: "Drop Price",         eq: "Y = f(Income, Temp)",        incomeCoeff: "−2.05",  r2: "0.484", color: H.gold,    note: "Income absorbs price's negative effect — the sign flips entirely. Severe bias introduced." },
                { model: "Drop Price & Temp",  eq: "Y = f(Income only)",         incomeCoeff: "−5.37",  r2: "0.112", color: H.crimson, note: "Coefficient is now massively distorted. R² collapses from 69.8% to just 11.2%." },
              ].map((m) => (
                <div key={m.model} style={{ background: H.white, border: `1px solid ${H.tan}`, borderLeft: `4px solid ${m.color}`, borderRadius: 8, padding: "16px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ color: m.color, fontWeight: 700, marginBottom: 4, fontSize: 15 }}>{m.model}</div>
                      <div style={{ fontFamily: "monospace", fontSize: 12, color: H.muted }}>{m.eq}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: H.muted, fontSize: 10, letterSpacing: 1 }}>INCOME COEFF</div>
                      <div style={{ color: m.color, fontWeight: 700, fontSize: 22, fontFamily: "monospace" }}>{m.incomeCoeff}</div>
                      <div style={{ color: H.muted, fontSize: 11 }}>R² = {m.r2}</div>
                    </div>
                  </div>
                  <div style={{ color: H.slate, fontSize: 13, lineHeight: 1.6, borderTop: `1px solid ${H.tan}`, paddingTop: 10 }}>{m.note}</div>
                </div>
              ))}
            </div>
            <InfoBox accentColor={H.crimsonDark} label="LESSON">
              <p style={{ margin: 0, color: H.slate, fontSize: 14, lineHeight: 1.75 }}>
                Omitted variable bias occurs when an excluded variable is <strong style={{ color: H.charcoal }}>correlated with both</strong> an included variable and the outcome. Never base marketing decisions on a biased model — the income-only result would wrongly suggest targeting high-income areas, the exact opposite of the correct finding.
              </p>
            </InfoBox>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36, paddingTop: 20, borderTop: `2px solid ${H.tan}` }}>
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{
            padding: "10px 24px", borderRadius: 4, border: `1px solid ${step === 0 ? H.tan : H.crimson}`,
            background: "transparent", color: step === 0 ? H.tan : H.crimson,
            cursor: step === 0 ? "default" : "pointer", fontSize: 14, fontFamily: "'Georgia', serif", fontWeight: 600,
          }}>← Previous</button>
          <div style={{ color: H.muted, fontSize: 13, alignSelf: "center", fontFamily: "monospace" }}>
            {step + 1} / {steps.length}
          </div>
          <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1} style={{
            padding: "10px 24px", borderRadius: 4, border: "none",
            background: step === steps.length - 1 ? H.tan : H.crimson,
            color: step === steps.length - 1 ? H.muted : H.white,
            cursor: step === steps.length - 1 ? "default" : "pointer", fontSize: 14, fontFamily: "'Georgia', serif", fontWeight: 600,
          }}>Next →</button>
        </div>
      </div>

      <Analytics />

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${H.tan}`, padding: "14px 32px", background: H.parchment, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 18, height: 18, background: H.crimson, borderRadius: 2 }} />
          <span style={{ color: H.muted, fontSize: 12, fontFamily: "monospace", letterSpacing: 1 }}>MULTIPLE REGRESSION WALKTHROUGH</span>
        </div>
        <div style={{ color: H.tan, fontSize: 11, fontFamily: "monospace" }}>OLS · n=48 · R²=0.698</div>
      </div>
    </div>
  );
}
