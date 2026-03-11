import { useState, useRef, useCallback, useEffect } from "react";

const FABRICS = [
  "Malha encorpada", "Viscose", "Linho", "Crepe", "Crepe Alfaiataria",
  "Chiffon", "Tule", "Seda", "Algodão", "Tencel", "Viscolinho",
  "Malha canelada", "Milano", "Jacquard", "Tricoline", "Cetim",
  "Dobby", "Musseline", "Rayon", "Egito",
];

const COMPOSITIONS = [
  "100% Poliéster",
  "96% Poliéster 4% Elastano",
  "100% Viscose",
  "97% Viscose 3% Elastano",
  "100% Algodão",
  "97% Algodão 3% Elastano",
  "52% Linho 48% Viscose",
  "100% Linho",
  "70% Viscose 30% Linho",
  "92% Poliéster 8% Elastano",
  "80% Poliéster 20% Viscose",
];

const LINING_COMPOSITIONS = [
  "100% Poliéster",
  "100% Viscose",
  "100% Algodão",
];

const PIECE_TYPES = [
  { value: "top", label: "Parte de cima" },
  { value: "bottom", label: "Parte de baixo" },
  { value: "full", label: "Peça inteira" },
];

// Tabela de medidas fixa — mesmas para todos os produtos
const SIZE_GUIDE_HTML = `<table style="border-collapse:collapse;width:100%;font-family:'Montserrat',sans-serif;font-size:12px;"><thead><tr style="background:#f5f5f5;"><th style="border:1px solid #ccc;padding:5px 8px;text-align:left;">Tamanho</th><th style="border:1px solid #ccc;padding:5px 8px;text-align:left;">Busto</th><th style="border:1px solid #ccc;padding:5px 8px;text-align:left;">Cintura</th><th style="border:1px solid #ccc;padding:5px 8px;text-align:left;">Quadril</th></tr></thead><tbody><tr><td style="border:1px solid #ccc;padding:5px 8px;">36 (PP)</td><td style="border:1px solid #ccc;padding:5px 8px;">86 – 90</td><td style="border:1px solid #ccc;padding:5px 8px;">70 – 74</td><td style="border:1px solid #ccc;padding:5px 8px;">95 – 99</td></tr><tr><td style="border:1px solid #ccc;padding:5px 8px;">38 (P)</td><td style="border:1px solid #ccc;padding:5px 8px;">90 – 94</td><td style="border:1px solid #ccc;padding:5px 8px;">74 – 78</td><td style="border:1px solid #ccc;padding:5px 8px;">99 – 103</td></tr><tr><td style="border:1px solid #ccc;padding:5px 8px;">40 (M)</td><td style="border:1px solid #ccc;padding:5px 8px;">94 – 98</td><td style="border:1px solid #ccc;padding:5px 8px;">78 – 82</td><td style="border:1px solid #ccc;padding:5px 8px;">103 – 107</td></tr><tr><td style="border:1px solid #ccc;padding:5px 8px;">42 (G)</td><td style="border:1px solid #ccc;padding:5px 8px;">98 – 102</td><td style="border:1px solid #ccc;padding:5px 8px;">82 – 84</td><td style="border:1px solid #ccc;padding:5px 8px;">107 – 111</td></tr><tr><td style="border:1px solid #ccc;padding:5px 8px;">44 (GG)</td><td style="border:1px solid #ccc;padding:5px 8px;">102 – 106</td><td style="border:1px solid #ccc;padding:5px 8px;">84 – 88</td><td style="border:1px solid #ccc;padding:5px 8px;">111 – 115</td></tr></tbody></table>`;

const BRAND_VOICE = `Você é a copywriter da IT LOOK, marca de moda feminina brasileira.
A marca veste uma mulher madura (45-55 anos), segura do próprio corpo. Ela sai à noite — jantar, bar, cinema, aniversário. Gosta de marcar a silhueta sem ser vulgar. Valoriza clavícula à mostra, decote na medida.

TOM DE VOZ: Elegante mas scannable. Informação útil com sofisticação, mas sem enrolação. Fale de OCASIÃO DE USO + COMO FUNCIONA NO CORPO + SUGESTÃO DE LOOK. Seja direta como uma consultora de estilo experiente.

ESTRUTURA DO PARÁGRAFO (2-3 frases médias):
1ª frase: O que é a peça + ocasião de uso concreta (jantar, bar, happy hour, aniversário, cinema, encontro)
2ª frase: Como ela funciona no corpo/estilo OU detalhe que faz diferença (abotoamento, decote, comprimento)
3ª frase: Sugestão de combinação prática (com que peças usar, em que contexto)

REGRAS:
- Máximo 2-3 frases de tamanho médio
- Seja específica: "jantar de sexta" é melhor que "ocasiões especiais"
- Fale de controle/versatilidade quando aplicável (ex: "abotoamento te dá controle sobre quanto mostrar")
- NUNCA use: "perfeita para", "não pode faltar", "peça-chave", "versátil", "atemporal", "essencial", "indispensável", "guarda-roupa"
- NUNCA seja poética ou use metáforas floridas

Responda EXATAMENTE neste formato:

[EMOCIONAL]
(2-3 frases médias, elegantes e scannables)

[TECNICO]
(Uma frase com os atributos separados por vírgula: tipo da peça, tecido/padrão, detalhes de modelagem visíveis, informação de forro)

[COMPOSICAO]
(liste os materiais separados por " | ", ex: "87% Viscose | 13% Poliamida". Sem texto adicional, sem frases introdutórias. Se não informada, escreva "Verificar composição")`;

const capitalizeMaterial = (text) => {
  const materials = ['poliéster', 'viscose', 'elastano', 'algodão', 'linho', 'poliamida', 'seda', 'tencel', 'rayon'];
  let result = text;
  materials.forEach(material => {
    const regex = new RegExp(material, 'gi');
    result = result.replace(regex, material.charAt(0).toUpperCase() + material.slice(1).toLowerCase());
  });
  return result;
};

export default function GeradorDescricao() {
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [fabric, setFabric] = useState("");
  const [fabricCustom, setFabricCustom] = useState("");
  const [lining, setLining] = useState("");
  const [liningComposition, setLiningComposition] = useState("");
  const [liningCompositionCustom, setLiningCompositionCustom] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [composition, setComposition] = useState("");
  const [compositionCustom, setCompositionCustom] = useState("");
  const [pieceType, setPieceType] = useState("full");

  const [emotionalText, setEmotionalText] = useState("");
  const [technicalText, setTechnicalText] = useState("");
  const [compositionText, setCompositionText] = useState("");

  const [modelSize, setModelSize] = useState("P");
  const [editingModelSize, setEditingModelSize] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 640);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;

    if (image) URL.revokeObjectURL(image);

    const newImageUrl = URL.createObjectURL(file);
    setImage(newImageUrl);

    const reader = new FileReader();
    reader.onload = () => {
      setImageData({ base64: reader.result.split(",")[1], mediaType: file.type });
    };
    reader.readAsDataURL(file);
  }, [image]);

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer?.files?.[0]);
  }, [handleFile]);

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          handleFile(item.getAsFile());
          break;
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handleFile]);

  const getFabric = () => fabricCustom || fabric;
  const getComposition = () => compositionCustom || composition;
  const getLiningComposition = () => liningCompositionCustom || liningComposition;

  const generate = async () => {
    setLoading(true);
    try {
      const content = [];
      if (imageData) {
        content.push({
          type: "image",
          source: { type: "base64", media_type: imageData.mediaType, data: imageData.base64 },
        });
      }

      let prompt = imageData
        ? "Analise esta peça e gere a descrição no formato solicitado."
        : "Gere a descrição baseada nas informações abaixo (sem foto disponível).";
      const f = getFabric();
      if (f) prompt += `\nTecido: ${f}`;
      const c = getComposition();
      if (c) prompt += `\nComposição: ${c}`;
      if (lining) prompt += `\nForro: ${lining}`;
      if (extraNotes) prompt += `\nObservações: ${extraNotes}`;

      content.push({ type: "text", text: prompt });

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: BRAND_VOICE,
          messages: [{ role: "user", content }],
        }),
      });

      if (!response.ok) {
        const raw = await response.text();
        let msg = `Erro ${response.status}`;
        try { msg = JSON.parse(raw).error || msg; } catch (_) { msg = raw.slice(0, 120) || msg; }
        throw new Error(msg);
      }

      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "";

      const emMatch = text.match(/\[EMOCIONAL\]\s*([\s\S]*?)(?=\[TECNICO\])/);
      const tcMatch = text.match(/\[TECNICO\]\s*([\s\S]*?)(?=\[COMPOSICAO\])/);
      const cpMatch = text.match(/\[COMPOSICAO\]\s*([\s\S]*?)$/);

      setEmotionalText(emMatch ? emMatch[1].trim() : "");
      setTechnicalText(tcMatch ? tcMatch[1].trim() : "");

      let finalComposition = cpMatch ? cpMatch[1].trim() : getComposition() || "";
      finalComposition = capitalizeMaterial(finalComposition);
      setCompositionText(finalComposition);

      setEditingField(null);
    } catch (err) {
      console.error(err);
      setEmotionalText(`Erro: ${err.message}`);
      setTechnicalText("");
      setCompositionText("");
    }
    setLoading(false);
  };

  const p = (content) => `<p style="margin:0 0 8px 0">${content}</p>`;

  const copyToClipboard = () => {
    const parts = [];

    if (emotionalText) parts.push(p(emotionalText));
    if (technicalText) parts.push(p(technicalText));
    if (compositionText) parts.push(p(`<strong>Composição:</strong> ${compositionText}`));

    const liningComp = getLiningComposition();
    if (lining === "Com forro" && liningComp) {
      parts.push(p(`<strong>Forro:</strong> ${capitalizeMaterial(liningComp)}`));
    }

    parts.push(p(`<strong>Guia de Medidas</strong> (medidas do corpo em cm):`));
    parts.push(SIZE_GUIDE_HTML);
    parts.push(p(`<em>Modelo veste ${modelSize}</em>`));

    const htmlContent = parts.join('');

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'fixed';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error('Erro ao copiar:', err);
      alert('Erro ao copiar. Tente selecionar e copiar manualmente.');
    }

    selection.removeAllRanges();
    document.body.removeChild(tempDiv);
  };

  const resetAll = () => {
    if (image) URL.revokeObjectURL(image);
    setImage(null); setImageData(null); setFabric(""); setFabricCustom("");
    setLining(""); setLiningComposition(""); setLiningCompositionCustom("");
    setExtraNotes(""); setComposition(""); setCompositionCustom("");
    setPieceType("full"); setEmotionalText(""); setTechnicalText("");
    setCompositionText(""); setEditingField(null); setModelSize("P"); setEditingModelSize(false);
  };

  const hasResult = emotionalText || technicalText;
  const showLiningComposition = lining === "Com forro";

  const EditableBlock = ({ label, value, onChange, fieldKey }) => {
    const isEditing = editingField === fieldKey;
    return (
      <div style={{ marginBottom: 14 }}>
        <div style={{
          fontSize: 10,
          letterSpacing: 1.2, textTransform: "uppercase",
          color: "#A8A3A0", marginBottom: 4,
        }}>{label}</div>
        {isEditing ? (
          <div>
            <textarea
              style={{
                width: "100%", minHeight: 80, padding: 12,
                border: "1px solid #2C2825", borderRadius: 3,
                lineHeight: 1.7, color: "#2C2825", resize: "vertical",
                outline: "none", background: "#FFFEF9",
              }}
              value={value}
              onChange={e => onChange(e.target.value)}
              autoFocus
            />
            <button
              onClick={() => setEditingField(null)}
              style={{
                marginTop: 4, padding: "4px 14px", background: "#2C2825",
                color: "white", border: "none", borderRadius: 3,
                fontFamily: "'Montserrat', sans-serif", fontSize: 11, cursor: "pointer",
              }}
            >OK</button>
          </div>
        ) : (
          <div
            onClick={() => setEditingField(fieldKey)}
            style={{
              padding: "10px 14px", background: "#FAFAF8", borderRadius: 3,
              cursor: "pointer", lineHeight: 1.7, color: "#2C2825", border: "1px solid transparent",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#E0DCD8"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
          >
            {value || <span style={{ color: "#C4BFB9" }}>Clique para editar</span>}
            <span style={{
              float: "right", fontSize: 10, color: "#B0ABA6",
              fontFamily: "'Montserrat', sans-serif",
            }}>✎</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#FAF9F7",
      fontFamily: "'Montserrat', sans-serif",
    }}>
      <style>{`
        html, body { font-family: 'Montserrat', sans-serif; font-size: 12px; }
        * { box-sizing: border-box; font-family: inherit; font-size: inherit; }
        .tool-label { font-size: 10px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: #8A8580; margin-bottom: 5px; display: block; }
        .tool-input { width: 100%; padding: 8px 12px; border: 1px solid #E0DCD8; border-radius: 3px; color: #2C2825; background: white; outline: none; transition: border-color 0.2s; }
        .tool-input:focus { border-color: #2C2825; }
        .tool-input::placeholder { color: #C4BFB9; }
        .tool-select { width: 100%; padding: 8px 12px; border: 1px solid #E0DCD8; border-radius: 3px; color: #2C2825; background: white; cursor: pointer; outline: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238A8580' fill='none' stroke-width='1.5'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
        .tool-select:focus { border-color: #2C2825; }
        .btn-main { width: 100%; padding: 11px; background: #2C2825; color: white; border: none; border-radius: 3px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .btn-main:hover { background: #1a1715; }
        .btn-main:disabled { background: #C4BFB9; cursor: not-allowed; }
        .loading-dots::after { content: ''; animation: dots 1.5s steps(4) infinite; }
        @keyframes dots { 0% { content: ''; } 25% { content: '.'; } 50% { content: '..'; } 75% { content: '...'; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .drop-zone { border: 2px dashed #D5D0CB; border-radius: 4px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s; background: white; }
        .drop-zone:hover, .drop-zone.active { border-color: #2C2825; background: #F5F4F2; }
        .pill-row { display: flex; gap: 6px; flex-wrap: wrap; }
        .pill { padding: 5px 12px; border: 1px solid #E0DCD8; border-radius: 20px; color: #6B6560; cursor: pointer; transition: all 0.15s; user-select: none; background: white; }
        .pill:hover { border-color: #2C2825; color: #2C2825; }
        .pill.active { background: #2C2825; border-color: #2C2825; color: white; }
        .main-grid { display: grid; gap: 28px; }
        .size-table { border-collapse: collapse; width: 100%; table-layout: fixed; }
        .size-table th, .size-table td { border: 1px solid #E0DCD8; padding: 4px 6px; text-align: left; word-break: break-word; }
        .size-table thead tr { background: #F5F4F2; }
        .size-table td { color: #2C2825; }
        .size-table th { color: #8A8580; font-weight: 500; font-size: 10px; letter-spacing: 0.4px; }
      `}</style>

      <div style={{ borderBottom: "1px solid #E0DCD8", padding: "20px 0", textAlign: "center", background: "white" }}>
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#A8A3A0", marginBottom: 4 }}>IT LOOK</div>
        <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 17, fontWeight: 300, color: "#2C2825", margin: 0 }}>Descrição de Produto</h1>
      </div>

      <div className="main-grid" style={{
        maxWidth: (hasResult && !isMobile) ? 880 : 460, margin: "0 auto", padding: "24px 16px",
        gridTemplateColumns: (hasResult && !isMobile) ? "1fr 1fr" : "1fr",
      }}>
        <div>
          <div style={{ marginBottom: 18 }}>
            <label className="tool-label">Foto do produto</label>
            {image ? (
              <div style={{ position: "relative" }}>
                <img src={image} alt="Produto" style={{ width: "100%", maxHeight: 260, objectFit: "contain", borderRadius: 3, border: "1px solid #E0DCD8", background: "white" }} />
                <button onClick={() => { setImage(null); setImageData(null); }}
                  style={{ position: "absolute", top: 8, right: 8, width: 26, height: 26, borderRadius: "50%", background: "rgba(44,40,37,0.8)", color: "white", border: "none", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
              </div>
            ) : (
              <div className={`drop-zone ${dragActive ? "active" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={onDrop}>
                <div style={{ fontSize: 28, marginBottom: 6, color: "#C4BFB9" }}>📷</div>
                <div style={{ color: "#8A8580" }}>
                  <span style={{ color: "#2C2825", fontWeight: 500 }}>Ctrl+V</span> para colar print
                  <span style={{ margin: "0 6px", color: "#D5D0CB" }}>|</span>
                  <span style={{ textDecoration: "underline", color: "#2C2825", cursor: "pointer" }}>buscar arquivo</span>
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => handleFile(e.target.files?.[0])} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="tool-label">Tipo de peça</label>
            <div className="pill-row">
              {PIECE_TYPES.map(t => (
                <span key={t.value} className={`pill ${pieceType === t.value ? "active" : ""}`}
                  onClick={() => setPieceType(t.value)}>{t.label}</span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="tool-label">Tecido</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <select className="tool-select" value={fabric} onChange={e => { setFabric(e.target.value); if (e.target.value) setFabricCustom(""); }}>
                <option value="">Selecione</option>
                {FABRICS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <input className="tool-input" placeholder="Ou digite aqui"
                value={fabricCustom}
                onChange={e => { setFabricCustom(e.target.value); if (e.target.value) setFabric(""); }} />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="tool-label">Forro</label>
            <div className="pill-row">
              {["Com forro", "Sem forro"].map(opt => (
                <span key={opt} className={`pill ${lining === opt ? "active" : ""}`}
                  onClick={() => setLining(lining === opt ? "" : opt)}>{opt}</span>
              ))}
            </div>
          </div>

          {showLiningComposition && (
            <div style={{ marginBottom: 12 }}>
              <label className="tool-label">Composição do Forro</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <select className="tool-select" value={liningComposition} onChange={e => { setLiningComposition(e.target.value); if (e.target.value) setLiningCompositionCustom(""); }}>
                  <option value="">Selecione</option>
                  {LINING_COMPOSITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input className="tool-input" placeholder="Ou digite aqui"
                  value={liningCompositionCustom}
                  onChange={e => { setLiningCompositionCustom(e.target.value); if (e.target.value) setLiningComposition(""); }} />
              </div>
            </div>
          )}

          <div style={{ marginBottom: 12 }}>
            <label className="tool-label">Composição</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <select className="tool-select" value={composition} onChange={e => { setComposition(e.target.value); if (e.target.value) setCompositionCustom(""); }}>
                <option value="">Selecione</option>
                {COMPOSITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input className="tool-input" placeholder="Ou digite aqui"
                value={compositionCustom}
                onChange={e => { setCompositionCustom(e.target.value); if (e.target.value) setComposition(""); }} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="tool-label">Observações (opcional)</label>
            <input className="tool-input" placeholder="Ex: zíper invisível, bordado, detalhe de corrente..."
              value={extraNotes} onChange={e => setExtraNotes(e.target.value)} />
          </div>

          <button className="btn-main" disabled={(!imageData && !getFabric()) || loading} onClick={generate}>
            {loading ? <span>Analisando<span className="loading-dots"></span></span>
              : hasResult ? "Regerar" : "Gerar descrição"}
          </button>
          {!imageData && !getFabric() && (
            <p style={{ fontSize: 10, color: "#A8A3A0", textAlign: "center", marginTop: 8 }}>
              Envie uma foto ou selecione o tecido</p>
          )}
        </div>

        {hasResult && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <label className="tool-label" style={{ margin: 0 }}>Resultado</label>
              <button onClick={resetAll}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#A8A3A0", textDecoration: "underline" }}>
                Limpar tudo</button>
            </div>

            <div style={{ background: "white", border: "1px solid #E0DCD8", borderRadius: 4, padding: 20 }}>
              <EditableBlock label="Texto" value={emotionalText}
                onChange={setEmotionalText} fieldKey="emotional" />

              <EditableBlock label="Ficha técnica" value={technicalText}
                onChange={setTechnicalText} fieldKey="technical" />

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", color: "#A8A3A0", marginBottom: 4 }}>Composição</div>
                <div style={{ padding: "8px 12px", background: "#FAFAF8", borderRadius: 3, lineHeight: 1.7, color: "#2C2825" }}>
                  <strong>Composição:</strong><br />{compositionText}
                </div>
              </div>

              {showLiningComposition && getLiningComposition() && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", color: "#A8A3A0", marginBottom: 4 }}>Forro</div>
                  <div style={{ padding: "8px 12px", background: "#FAFAF8", borderRadius: 3, lineHeight: 1.7, color: "#2C2825" }}>
                    <strong>Forro:</strong><br />{capitalizeMaterial(getLiningComposition())}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", color: "#A8A3A0", marginBottom: 4 }}>Guia de Medidas</div>
                <div style={{ padding: "8px 10px", background: "#FAFAF8", borderRadius: 3 }}>
                  <table className="size-table">
                    <colgroup>
                      <col style={{ width: "30%" }} />
                      <col style={{ width: "23%" }} />
                      <col style={{ width: "23%" }} />
                      <col style={{ width: "24%" }} />
                    </colgroup>
                    <thead>
                      <tr><th>Tam.</th><th>Busto</th><th>Cin.</th><th>Quadril</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>36 (PP)</td><td>86–90</td><td>70–74</td><td>95–99</td></tr>
                      <tr><td>38 (P)</td><td>90–94</td><td>74–78</td><td>99–103</td></tr>
                      <tr><td>40 (M)</td><td>94–98</td><td>78–82</td><td>103–107</td></tr>
                      <tr><td>42 (G)</td><td>98–102</td><td>82–84</td><td>107–111</td></tr>
                      <tr><td>44 (GG)</td><td>102–106</td><td>84–88</td><td>111–115</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ marginBottom: 4 }}>
                <div style={{ fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", color: "#A8A3A0", marginBottom: 4 }}>Tamanho do modelo</div>
                {editingModelSize ? (
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input
                      style={{ padding: "6px 10px", border: "1px solid #2C2825", borderRadius: 3, color: "#2C2825", width: 80, outline: "none" }}
                      value={modelSize}
                      onChange={e => setModelSize(e.target.value)}
                      autoFocus
                      onKeyDown={e => { if (e.key === "Enter") setEditingModelSize(false); }}
                    />
                    <button onClick={() => setEditingModelSize(false)}
                      style={{ padding: "6px 12px", background: "#2C2825", color: "white", border: "none", borderRadius: 3, cursor: "pointer" }}>
                      OK
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => setEditingModelSize(true)}
                    style={{ padding: "8px 12px", background: "#FAFAF8", borderRadius: 3, color: "#8A8580", fontStyle: "italic", cursor: "pointer", border: "1px solid transparent", transition: "border-color 0.2s", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#E0DCD8"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
                  >
                    <span>Modelo veste {modelSize}</span>
                    <span style={{ fontSize: 10, color: "#B0ABA6" }}>✎</span>
                  </div>
                )}
              </div>
            </div>

            <button className="btn-main" onClick={copyToClipboard}
              style={{ marginTop: 16, background: copied ? "#3D6B4F" : "#2C2825" }}>
              {copied ? "✓ Copiado!" : "Copiar descrição"}
            </button>
            <p style={{ fontSize: 10, color: "#B0ABA6", textAlign: "center", marginTop: 6 }}>
              Cola na Nuvemshop com negrito, itálico e quebras de linha
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
