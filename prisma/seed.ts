import "dotenv/config";
import {Pool} from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

const stocks = [
    { id: 1, name: "Nova Energies", secteur: "Énergie", price: 187.42, volatility: 0.32, drift: 0.05 },
    { id: 2, name: "Zephyr Supply Co.", secteur: "Logistique", price: 43.17, volatility: 0.25, drift: -0.02 },
    { id: 3, name: "Luxara Holdings", secteur: "Luxe", price: 312.89, volatility: 0.18, drift: 0.08 },
    { id: 4, name: "Corvex Biotech", secteur: "Santé", price: 78.56, volatility: 0.45, drift: 0.03 },
    { id: 5, name: "Orbion Aerospace", secteur: "Aérospatial", price: 524.30, volatility: 0.38, drift: 0.07 },
    { id: 6, name: "Matrixa AI", secteur: "Tech", price: 256.74, volatility: 0.52, drift: 0.12 },
    { id: 7, name: "Fonder Finance", secteur: "Finance", price: 91.03, volatility: 0.20, drift: -0.01 },
    { id: 8, name: "Aquasphere Inc.", secteur: "Environnement", price: 34.21, volatility: 0.30, drift: 0.04 },
    { id: 9, name: "Vulkan Motors", secteur: "Automobile", price: 148.90, volatility: 0.35, drift: -0.03 },
    { id: 10, name: "Pulsar Media", secteur: "Média", price: 62.38, volatility: 0.28, drift: 0.02 },
    { id: 11, name: "Kinnetix Robotics", secteur: "Tech", price: 203.15, volatility: 0.48, drift: 0.10 },
    { id: 12, name: "Silver Peak Mining", secteur: "Matériaux", price: 55.67, volatility: 0.40, drift: -0.01 },
    { id: 13, name: "Horizon Pharma", secteur: "Santé", price: 119.44, volatility: 0.33, drift: 0.06 },
    { id: 14, name: "CloudStax", secteur: "Tech", price: 174.82, volatility: 0.50, drift: 0.09 },
    { id: 15, name: "Terrain Agritech", secteur: "Agriculture", price: 28.93, volatility: 0.22, drift: 0.01 },
    { id: 16, name: "Nexon Semiconductors", secteur: "Tech", price: 389.56, volatility: 0.46, drift: 0.11 },
    { id: 17, name: "Borealis Telecom", secteur: "Télécom", price: 67.19, volatility: 0.19, drift: 0.00 },
    { id: 18, name: "Pyra Games", secteur: "Divertissement", price: 42.85, volatility: 0.55, drift: 0.06 },
    { id: 19, name: "GreenArc Solar", secteur: "Énergie", price: 96.71, volatility: 0.34, drift: 0.04 },
    { id: 20, name: "Dominex Corp.", secteur: "Industrie", price: 158.03, volatility: 0.26, drift: -0.02 },
];

async function main() {
    for (const stock of stocks) {
        await prisma.sandboxStock.upsert({
            where: { id: stock.id },
            update: {
                name: stock.name,
                secteur: stock.secteur,
                price: stock.price,
                volatility: stock.volatility,
                drift: stock.drift,
            },
            create: {
                id: stock.id,
                name: stock.name,
                secteur: stock.secteur,
                price: stock.price,
                volatility: stock.volatility,
                drift: stock.drift,
            },
        });
    }
    console.log("Seed terminé : 20 actions sandbox insérées.");
}

main()
    .catch(async (e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
