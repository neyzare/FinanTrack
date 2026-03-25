import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const stocks = [
    { id: 1, name: "Nova Energies", secteur: "Énergie", Price: 187.42, volatility: 0.32, Drift: 0.05 },
    { id: 2, name: "Zephyr Supply Co.", secteur: "Logistique", Price: 43.17, volatility: 0.25, Drift: -0.02 },
    { id: 3, name: "Luxara Holdings", secteur: "Luxe", Price: 312.89, volatility: 0.18, Drift: 0.08 },
    { id: 4, name: "Corvex Biotech", secteur: "Santé", Price: 78.56, volatility: 0.45, Drift: 0.03 },
    { id: 5, name: "Orbion Aerospace", secteur: "Aérospatial", Price: 524.30, volatility: 0.38, Drift: 0.07 },
    { id: 6, name: "Matrixa AI", secteur: "Tech", Price: 256.74, volatility: 0.52, Drift: 0.12 },
    { id: 7, name: "Fonder Finance", secteur: "Finance", Price: 91.03, volatility: 0.20, Drift: -0.01 },
    { id: 8, name: "Aquasphere Inc.", secteur: "Environnement", Price: 34.21, volatility: 0.30, Drift: 0.04 },
    { id: 9, name: "Vulkan Motors", secteur: "Automobile", Price: 148.90, volatility: 0.35, Drift: -0.03 },
    { id: 10, name: "Pulsar Media", secteur: "Média", Price: 62.38, volatility: 0.28, Drift: 0.02 },
    { id: 11, name: "Kinnetix Robotics", secteur: "Tech", Price: 203.15, volatility: 0.48, Drift: 0.10 },
    { id: 12, name: "Silver Peak Mining", secteur: "Matériaux", Price: 55.67, volatility: 0.40, Drift: -0.01 },
    { id: 13, name: "Horizon Pharma", secteur: "Santé", Price: 119.44, volatility: 0.33, Drift: 0.06 },
    { id: 14, name: "CloudStax", secteur: "Tech", Price: 174.82, volatility: 0.50, Drift: 0.09 },
    { id: 15, name: "Terrain Agritech", secteur: "Agriculture", Price: 28.93, volatility: 0.22, Drift: 0.01 },
    { id: 16, name: "Nexon Semiconductors", secteur: "Tech", Price: 389.56, volatility: 0.46, Drift: 0.11 },
    { id: 17, name: "Borealis Telecom", secteur: "Télécom", Price: 67.19, volatility: 0.19, Drift: 0.00 },
    { id: 18, name: "Pyra Games", secteur: "Divertissement", Price: 42.85, volatility: 0.55, Drift: 0.06 },
    { id: 19, name: "GreenArc Solar", secteur: "Énergie", Price: 96.71, volatility: 0.34, Drift: 0.04 },
    { id: 20, name: "Dominex Corp.", secteur: "Industrie", Price: 158.03, volatility: 0.26, Drift: -0.02 },
];

async function main() {
    for (const stock of stocks) {
        await prisma.sandboxStock.upsert({
            where: { id: stock.id },
            update: {
                name: stock.name,
                secteur: stock.secteur,
                Price: stock.Price,
                volatility: stock.volatility,
                Drift: stock.Drift,
            },
            create: {
                id: stock.id,
                name: stock.name,
                secteur: stock.secteur,
                Price: stock.Price,
                volatility: stock.volatility,
                Drift: stock.Drift,
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
