import "dotenv/config";
import {Pool} from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const stocks = [
    { id: 1, name: "Nova Energies", secteur: "Énergie", price: 187.42 },
    { id: 2, name: "Zephyr Supply Co.", secteur: "Logistique", price: 43.17 },
    { id: 3, name: "Luxara Holdings", secteur: "Luxe", price: 312.89 },
    { id: 4, name: "Corvex Biotech", secteur: "Santé", price: 78.56 },
    { id: 5, name: "Orbion Aerospace", secteur: "Aérospatial", price: 524.30 },
    { id: 6, name: "Matrixa AI", secteur: "Tech", price: 256.74 },
    { id: 7, name: "Fonder Finance", secteur: "Finance", price: 91.03 },
    { id: 8, name: "Aquasphere Inc.", secteur: "Environnement", price: 34.21 },
    { id: 9, name: "Vulkan Motors", secteur: "Automobile", price: 148.90 },
    { id: 10, name: "Pulsar Media", secteur: "Média", price: 62.38 },
    { id: 11, name: "Kinnetix Robotics", secteur: "Tech", price: 203.15 },
    { id: 12, name: "Silver Peak Mining", secteur: "Matériaux", price: 55.67 },
    { id: 13, name: "Horizon Pharma", secteur: "Santé", price: 119.44 },
    { id: 14, name: "CloudStax", secteur: "Tech", price: 174.82 },
    { id: 15, name: "Terrain Agritech", secteur: "Agriculture", price: 28.93 },
    { id: 16, name: "Nexon Semiconductors", secteur: "Tech", price: 389.56 },
    { id: 17, name: "Borealis Telecom", secteur: "Télécom", price: 67.19 },
    { id: 18, name: "Pyra Games", secteur: "Divertissement", price: 42.85 },
    { id: 19, name: "GreenArc Solar", secteur: "Énergie", price: 96.71 },
    { id: 20, name: "Dominex Corp.", secteur: "Industrie", price: 158.03 },
];

async function main() {
    for (const stock of stocks) {
        await prisma.sandboxStock.upsert({
            where: { id: stock.id },
            update: {
                name: stock.name,
                secteur: stock.secteur,
                price: stock.price,
            },
            create: {
                id: stock.id,
                name: stock.name,
                secteur: stock.secteur,
                price: stock.price,
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
