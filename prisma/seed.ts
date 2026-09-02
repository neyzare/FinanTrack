import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const stocks = [
  { id: 1, name: "Exxoon Mobeil", secteur: "Énergie", price: 187.42 },
  { id: 2, name: "FedDex Express", secteur: "Logistique", price: 43.17 },
  { id: 3, name: "Lui Viton", secteur: "Luxe", price: 312.89 },
  { id: 4, name: "Faizer", secteur: "Santé", price: 78.56 },
  { id: 5, name: "Booying", secteur: "Aérospatial", price: 524.3 },
  { id: 6, name: "Goougle", secteur: "Tech", price: 256.74 },
  { id: 7, name: "Goldmann Saxo", secteur: "Finance", price: 91.03 },
  { id: 8, name: "Veaulia", secteur: "Environnement", price: 34.21 },
  { id: 9, name: "Teslaaa Motors", secteur: "Automobile", price: 148.9 },
  { id: 10, name: "Netfloox", secteur: "Média", price: 62.38 },
  { id: 11, name: "Bostonn Dynamix", secteur: "Tech", price: 203.15 },
  { id: 12, name: "Rio Pinto", secteur: "Matériaux", price: 55.67 },
  { id: 13, name: "AstraZinéka", secteur: "Santé", price: 119.44 },
  { id: 14, name: "Microflop", secteur: "Tech", price: 174.82 },
  { id: 15, name: "John Beere", secteur: "Agriculture", price: 28.93 },
  { id: 16, name: "Envidia", secteur: "Tech", price: 389.56 },
  { id: 17, name: "Orang'eade Telecom", secteur: "Télécom", price: 67.19 },
  { id: 18, name: "Nontendo", secteur: "Divertissement", price: 42.85 },
  { id: 19, name: "Sun-Pouvoir", secteur: "Énergie", price: 96.71 },
  { id: 20, name: "Genial Electrik", secteur: "Industrie", price: 158.03 },
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
