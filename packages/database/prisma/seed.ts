import { prisma } from '../src';

//producto, evento, cliente, industria
const categories = [
  {
    name: 'product',
  },
  {
    name: 'event',
  },
  {
    name: 'client',
  },
  {
    name: 'insdustry',
  },
];

// ===== SEED MAIN FUNCTION =====
async function main() {
  console.log('🗑️  Cleaning DB...');

  await prisma.category.deleteMany({});
  await prisma.tag.deleteMany({});

  console.log('✅ DB Clean');

  // create categories
  console.log('🏷️  Creating Categories...');
  const CategoriesPromise = categories.map(async (category) => {
    return prisma.category.create({
      data: {
        name: category.name,
      },
    });
  });

  const createdCategories = await Promise.all(CategoriesPromise);
  console.log(`✅ ${createdCategories.length} Categories Created\n`);

  /* // Crear Categories
  console.log('📁 Creando categorías...');
  const categoryPromises = initCategories.map(async (category) => {
    const imageUrl = await uploadImage(category.imageUrl);
    return prisma.category.create({
      data: {
        name: category.name,
        imageUrl: imageUrl,
      },
    });
  });

  const createdCategories = await Promise.all(categoryPromises);
  console.log(`✅ ${createdCategories.length} categorías creadas\n`); */

  console.log('\n🎉 Seed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error in seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
