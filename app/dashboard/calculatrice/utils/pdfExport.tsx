import { Document, Page as PDFPage, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import { toast } from 'sonner';

interface LignePDF {
    label: string;
    valeur: string;
}

export interface SectionPDF {
    titre: string;
    lignes: LignePDF[];
}

const stylesPDF = StyleSheet.create({
    page: { padding: 32, fontSize: 11, color: '#0F172A' },
    titre: { fontSize: 18, marginBottom: 8 },
    date: { fontSize: 10, color: '#475569', marginBottom: 18 },
    section: { marginBottom: 16, padding: 12, borderRadius: 6, border: '1 solid #E2E8F0' },
    sectionTitre: { fontSize: 13, marginBottom: 8, color: '#1E293B' },
    ligne: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    label: { color: '#475569' },
    valeur: { color: '#0F172A' },
});

function nomFichierPDF(typeCalcul: string): string {
    const horodatage = new Date().toISOString().slice(0, 10);
    const slug = typeCalcul
        .toLowerCase()
        .replace(/[\s']/g, '-')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');
    return `${slug}-${horodatage}.pdf`;
}

export async function exporterPDF(typeCalcul: string, sections: SectionPDF[]): Promise<void> {
    try {
        const dateGeneration = new Date().toLocaleString('fr-FR');
        const pdfDocument = (
            <Document>
                <PDFPage size="A4" style={stylesPDF.page}>
                    <Text style={stylesPDF.titre}>FinanTrack - Export {typeCalcul}</Text>
                    <Text style={stylesPDF.date}>Généré le {dateGeneration}</Text>
                    {sections.map((section) => (
                        <View key={section.titre} style={stylesPDF.section}>
                            <Text style={stylesPDF.sectionTitre}>{section.titre}</Text>
                            {section.lignes.map((ligne) => (
                                <View key={ligne.label} style={stylesPDF.ligne}>
                                    <Text style={stylesPDF.label}>{ligne.label}</Text>
                                    <Text style={stylesPDF.valeur}>{ligne.valeur}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </PDFPage>
            </Document>
        );

        const blob = await pdf(pdfDocument).toBlob();
        const url = URL.createObjectURL(blob);
        const lien = document.createElement('a');
        const fichier = nomFichierPDF(typeCalcul);
        lien.href = url;
        lien.download = fichier;
        lien.click();
        URL.revokeObjectURL(url);

        toast.success('PDF exporté avec succès', {
            description: `${typeCalcul} — ${fichier}`,
        });
    } catch (error) {
        console.error('Erreur export PDF:', error);
        toast.error("Échec de l'export PDF", {
            description: "Une erreur est survenue lors de la génération du fichier.",
        });
    }
}
