const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log('🧹 Iniciando limpieza de la base de datos...');
    
    // Eliminar en orden para respetar las relaciones de foreign keys
    
    // 1. Eliminar SessionExercise (depende de Session y Exercise)
    const sessionExercises = await prisma.sessionExercise.deleteMany({});
    console.log(`✅ Eliminados ${sessionExercises.count} registros de SessionExercise`);
    
    // 2. Eliminar ExerciseProgress (depende de Exercise)
    const exerciseProgress = await prisma.exerciseProgress.deleteMany({});
    console.log(`✅ Eliminados ${exerciseProgress.count} registros de ExerciseProgress`);
    
    // 3. Eliminar Exercise (depende de Book)
    const exercises = await prisma.exercise.deleteMany({});
    console.log(`✅ Eliminados ${exercises.count} ejercicios`);
    
    // 4. Eliminar Session (depende de User)
    const sessions = await prisma.session.deleteMany({});
    console.log(`✅ Eliminadas ${sessions.count} sesiones`);
    
    // 5. Eliminar Book (depende de User)
    const books = await prisma.book.deleteMany({});
    console.log(`✅ Eliminados ${books.count} libros`);
    
    // 6. Eliminar Goal (depende de User)
    const goals = await prisma.goal.deleteMany({});
    console.log(`✅ Eliminadas ${goals.count} metas`);
    
    // 7. Eliminar LevelHistory (depende de User)
    const levelHistory = await prisma.levelHistory.deleteMany({});
    console.log(`✅ Eliminados ${levelHistory.count} registros de historial de nivel`);
    
    // Verificar usuarios existentes
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        instruments: true,
        currentLevel: true,
        createdAt: true
      }
    });
    
    console.log('\n🎯 Limpieza completada exitosamente!');
    console.log('\n👥 Usuarios conservados:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   - Instrumentos: ${user.instruments.join(', ')}`);
      console.log(`   - Nivel: ${user.currentLevel}`);
      console.log(`   - Registrado: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });
    
    console.log('📊 Resumen de la limpieza:');
    console.log('✅ Todos los datos eliminados excepto usuarios');
    console.log('✅ Libros: eliminados');
    console.log('✅ Ejercicios: eliminados');
    console.log('✅ Sesiones: eliminados');
    console.log('✅ Progreso de ejercicios: eliminado');
    console.log('✅ Metas: eliminadas');
    console.log('✅ Historial de niveles: eliminado');
    console.log(`✅ Usuarios conservados: ${users.length}`);
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Función de confirmación
async function confirmAndClear() {
  console.log('⚠️  ADVERTENCIA: Esta operación eliminará TODOS los datos excepto los usuarios.');
  console.log('📚 Se eliminarán: libros, ejercicios, sesiones, progreso, metas, historial de niveles');
  console.log('👥 Se conservarán: usuarios y sus credenciales');
  console.log('');
  
  // En un entorno de producción, podrías usar readline para confirmación
  // Por ahora, ejecutamos directamente
  console.log('🚀 Procediendo con la limpieza...');
  await clearDatabase();
}

// Ejecutar si se llama directamente
if (require.main === module) {
  confirmAndClear()
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { clearDatabase };