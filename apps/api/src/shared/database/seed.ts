import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { seedExercises } from '../../domains/exercises/exercises.seeder';
import dataSource from './typeorm.config';

async function runSeed() {
  console.log('🌱 Starting seeder...');
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    await dataSource.initialize();
    console.log('✅ Database connected');
    
    await seedExercises(dataSource);
    
    console.log('✅ Seeding completed successfully');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    await app.close();
    process.exit(0);
  }
}

runSeed();
