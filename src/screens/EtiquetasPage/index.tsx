import { useRef, useMemo } from "react";
import Etiqueta from "../../components/basics/Etiqueta";
import styled from "styled-components";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { COLORS } from "../../constants/colors";
import AppButton from "../../components/basics/AppButton";
import { Download } from "lucide-react";
import type { PatrimonioIndividual } from "../../types/patrimonioTypes";

declare global {
    interface Window {
        showSaveFilePicker?: (options?: {
            suggestedName?: string;
            types?: {
                description: string;
                accept: Record<string, string[]>;
            }[];
        }) => Promise<{
            createWritable: () => Promise<{
                write: (data: Blob) => Promise<void>;
                close: () => Promise<void>;
            }>;
        }>;
    }
}

type EtiquetasPageProps = {
    ids?: string[];
    patrimonios: PatrimonioIndividual[];
};

export default function EtiquetasPage({ ids = [], patrimonios = [] }: EtiquetasPageProps) {
    const etiquetasRef = useRef<HTMLDivElement>(null);

    const etiquetasFiltradas = useMemo(() => {
        if (!ids || ids.length === 0) return [];
        const idsNormalizados = ids.map((id) => id.trim());
        return patrimonios.filter((p) => idsNormalizados.includes(p.id.trim()));
    }, [ids, patrimonios]);

    const gerarPDF = async () => {
        if (!etiquetasRef.current) return;

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: "a4",
            compress: true,
        });

        pdf.internal.scaleFactor = 1;

        const canvas = await html2canvas(etiquetasRef.current, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.9);
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const positionY = 20;

        if (imgHeight > pageHeight) {
            const totalPages = Math.ceil(imgHeight / pageHeight);
            for (let i = 0; i < totalPages; i++) {
                const startY = -(pageHeight * i);
                pdf.addImage(imgData, "JPEG", 20, startY + 20, imgWidth, imgHeight);
                if (i < totalPages - 1) pdf.addPage();
            }
        } else {
            pdf.addImage(imgData, "JPEG", 20, positionY, imgWidth, imgHeight);
        }

        const pdfBlob = pdf.output("blob");

        if (typeof window.showSaveFilePicker === "function") {
            try {
                const handle = await window.showSaveFilePicker({
                    suggestedName: "etiquetas.pdf",
                    types: [
                        { description: "Arquivo PDF", accept: { "application/pdf": [".pdf"] } }
                    ]
                });
                const writable = await handle.createWritable();
                await writable.write(pdfBlob);
                await writable.close();
                return;
            } catch (error) {
                console.error("Erro ao salvar:", error);
                return;
            }
        }

        const link = document.createElement("a");
        link.href = URL.createObjectURL(pdfBlob);
        link.download = "etiquetas.pdf";
        link.click();
        URL.revokeObjectURL(link.href);
    };


    return (
        <Box>
            <Header>
                <AppButton
                    text="Salvar como PDF"
                    func={gerarPDF}
                    color={COLORS.primary}
                    icon={<Download size={20} />}
                />
            </Header>

            {etiquetasFiltradas.length > 0 ? (
                <EtiquetasGrid ref={etiquetasRef}>
                    {etiquetasFiltradas.map((patrimonio) => (
                        <Etiqueta
                            key={patrimonio.id}
                            codigo={patrimonio.id}
                            id={patrimonio.id}
                        />
                    ))}
                </EtiquetasGrid>
            ) : (
                <MensagemVazia>
                    Nenhum item válido encontrado para gerar etiquetas.
                </MensagemVazia>
            )}
        </Box>
    );
}

const Box = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px;
`;

const Header = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
`;

const EtiquetasGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  padding: 20px;
  border-radius: 8px;
`;

const MensagemVazia = styled.p`
  text-align: center;
  color: ${COLORS.gray};
  font-size: 15px;
  margin-top: 40px;
`;