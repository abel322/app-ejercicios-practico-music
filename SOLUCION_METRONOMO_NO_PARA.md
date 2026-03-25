# Solución: Metrónomo no se detiene al finalizar tiempo

## Problema
El metrónomo continuaba reproduciendo sonidos incluso después de que el tiempo se completara o el usuario presionara "Finalizar", a pesar de que el estado `metronomeActive` se establecía en `false`.

## Causa raíz
1. **AudioContext activo**: El `AudioContext` permanecía en estado `running` incluso después de detener el scheduler, permitiendo que los osciladores programados continuaran reproduciéndose.
2. **Timeouts pendientes**: Los timeouts del scheduler podían seguir ejecutándose después de intentar detenerlos.
3. **Sincronización de estados**: El cambio de estado no era suficiente para detener los sonidos ya programados en el AudioContext.

## Solución implementada

### 1. Suspender AudioContext al detener
Agregamos `audioContext.suspend()` para pausar completamente el contexto de audio:

```typescript
// En pause() y en el useEffect de autoStart
if (audioContextRef.current && audioContextRef.current.state === 'running') {
  audioContextRef.current.suspend();
}
```

### 2. Reanudar AudioContext al iniciar
Aseguramos que el AudioContext se reanude cuando se inicia el metrónomo:

```typescript
// En start()
if (audioContextRef.current.state === 'suspended') {
  audioContextRef.current.resume();
}
```

### 3. Delays para sincronización
Agregamos pequeños delays en PracticeSession para asegurar que los cambios de estado se procesen correctamente:

```typescript
// Al completar el tiempo
setTimeout(() => {
  setMetronomeActive(false);
}, 50);

setTimeout(() => {
  setShowReflectionModal(true);
}, 100);
```

### 4. Detener inmediatamente al presionar Finalizar
```typescript
const stopTimer = useCallback(() => {
  // Detener todo inmediatamente
  setIsRunning(false);
  setIsPaused(false);
  setMetronomeActive(false);
  
  // Mostrar modal después de asegurar que el metrónomo se detuvo
  setTimeout(() => {
    setShowReflectionModal(true);
  }, 100);
}, [elapsedSeconds, showNotification]);
```

## Archivos modificados
- `frontend/src/components/Metronome.tsx`: Agregado suspend/resume del AudioContext
- `frontend/src/pages/PracticeSession.tsx`: Mejorada sincronización de estados con delays

## Resultado
El metrónomo ahora se detiene completamente cuando:
- El tiempo objetivo se completa
- El usuario presiona "Finalizar"
- El usuario presiona "Pausar"

## Cómo probar
1. Selecciona un ejercicio y establece un tiempo (ej: 1 minuto)
2. Presiona "Iniciar" - el metrónomo debe comenzar inmediatamente
3. Espera a que el tiempo se complete - el metrónomo debe detenerse y aparecer el modal
4. O presiona "Finalizar" antes de que termine - el metrónomo debe detenerse inmediatamente

## Nota técnica
La clave está en usar `AudioContext.suspend()` en lugar de solo detener el scheduler. Esto pausa todo el contexto de audio, incluyendo cualquier oscilador que ya haya sido programado para reproducirse en el futuro.
