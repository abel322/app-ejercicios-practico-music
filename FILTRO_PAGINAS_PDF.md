# Filtro de Páginas en el Visualizador de PDF

## ✅ Funcionalidad Implementada

Ahora el visualizador de PDF muestra **solo las páginas específicas** que registraste al crear el ejercicio.

## 🎯 Cómo Funciona

### Al Crear un Ejercicio

Cuando creas un ejercicio, especificas las páginas en el campo "Páginas". Puedes usar varios formatos:

**Formatos Soportados:**
- **Rango:** `5-8` → Muestra páginas 5, 6, 7, 8
- **Página individual:** `10` → Muestra solo la página 10
- **Múltiples páginas:** `1,3,5` → Muestra páginas 1, 3, 5
- **Combinación:** `1-3,5,7-9` → Muestra páginas 1, 2, 3, 5, 7, 8, 9

### Durante la Práctica

Cuando seleccionas un ejercicio en la "Sesión de Práctica":

1. El sistema lee el campo `pages` del ejercicio (ej: "5-8")
2. Parsea el rango y genera un array de páginas permitidas: `[5, 6, 7, 8]`
3. El PDF solo muestra esas páginas específicas
4. Los controles de navegación (anterior/siguiente) solo navegan entre esas páginas

## 📊 Ejemplo Visual

### Ejercicio: "Paradiddle Exercise"
- **Libro:** Stick Control
- **Páginas registradas:** `5-8`

**Resultado en el visualizador:**
```
Página actual: 5 / 4 (5-8)
              ↑   ↑   ↑
              │   │   └─ Rango completo
              │   └───── Total de páginas en el rango
              └───────── Página actual
```

**Navegación:**
- Primera página: 5
- Siguiente: 6
- Siguiente: 7
- Siguiente: 8
- Última página: 8 (botón "Siguiente" deshabilitado)

## 🔧 Implementación Técnica

### Función de Parseo

```typescript
const parsePageRange = (range: string): number[] => {
  // Entrada: "5-8,10,12-14"
  // Salida: [5, 6, 7, 8, 10, 12, 13, 14]
  
  const pages: number[] = [];
  const parts = range.split(',').map(p => p.trim());
  
  for (const part of parts) {
    if (part.includes('-')) {
      // Rango: "5-8"
      const [start, end] = part.split('-').map(n => parseInt(n.trim()));
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    } else {
      // Página individual: "10"
      const page = parseInt(part);
      pages.push(page);
    }
  }
  
  return [...new Set(pages)].sort((a, b) => a - b);
};
```

### Props del PDFViewer

```typescript
interface PDFViewerProps {
  fileUrl: string;
  onClose?: () => void;
  pageRange?: string; // NUEVO: Rango de páginas
}
```

### Estado del Componente

```typescript
const [allowedPages, setAllowedPages] = useState<number[]>([]);
const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
```

- `allowedPages`: Array de páginas permitidas [5, 6, 7, 8]
- `currentPageIndex`: Índice actual en el array (0 = primera página del rango)

### Navegación

**Anterior:**
```typescript
if (currentPageIndex > 0) {
  const newIndex = currentPageIndex - 1;
  const newPage = allowedPages[newIndex];
  setPageNumber(newPage);
}
```

**Siguiente:**
```typescript
if (currentPageIndex < allowedPages.length - 1) {
  const newIndex = currentPageIndex + 1;
  const newPage = allowedPages[newIndex];
  setPageNumber(newPage);
}
```

## 💡 Ventajas

### Para el Usuario
- ✅ Solo ves las páginas relevantes del ejercicio
- ✅ No te pierdes navegando por todo el libro
- ✅ Enfoque directo en lo que necesitas practicar
- ✅ Navegación más rápida entre páginas del ejercicio

### Para la Práctica
- ✅ Menos distracciones
- ✅ Flujo de trabajo más eficiente
- ✅ Claridad sobre qué páginas trabajar
- ✅ Mejor organización del estudio

## 🎵 Ejemplo de Uso Completo

### 1. Crear Ejercicio
```
Nombre: Single Stroke Roll
Libro: Stick Control
Páginas: 5-8
Dificultad: Básico
```

### 2. Practicar
1. Ve a "Sesión de Práctica"
2. Selecciona "Single Stroke Roll"
3. El PDF se abre mostrando la página 5
4. Usa los controles para navegar: 5 → 6 → 7 → 8
5. No puedes ir a la página 4 o 9 (fuera del rango)

### 3. Indicador Visual
```
┌─────────────────────────────────────┐
│  ◀  [5] / 4 (5-8)  ▶               │
│      ↑    ↑   ↑                     │
│      │    │   └─ Rango registrado   │
│      │    └───── 4 páginas totales  │
│      └────────── Página actual      │
└─────────────────────────────────────┘
```

## 🔄 Modo Sin Rango

Si un ejercicio **no tiene páginas especificadas** o el campo está vacío:
- El PDF muestra **todas las páginas** del libro
- Navegación normal: 1 → 2 → 3 → ... → última página
- Indicador: `[5] / 120` (página 5 de 120 totales)

## 📝 Formatos de Páginas Válidos

| Formato | Ejemplo | Resultado |
|---------|---------|-----------|
| Rango simple | `5-8` | Páginas 5, 6, 7, 8 |
| Página única | `10` | Solo página 10 |
| Lista | `1,3,5` | Páginas 1, 3, 5 |
| Combinado | `1-3,5,7-9` | Páginas 1, 2, 3, 5, 7, 8, 9 |
| Con espacios | `5 - 8, 10` | Páginas 5, 6, 7, 8, 10 |

## 🐛 Manejo de Errores

### Páginas Inválidas
Si el rango contiene páginas que no existen en el PDF:
- Se ignoran las páginas inválidas
- Solo se muestran las páginas válidas
- Ejemplo: Rango `5-100` en un PDF de 50 páginas → Muestra 5-50

### Formato Incorrecto
Si el formato es incorrecto:
- Se intenta parsear lo mejor posible
- Páginas no parseables se ignoran
- Si no se puede parsear nada, muestra todas las páginas

## 🎨 Mejoras Visuales

### Indicador de Rango
El contador de páginas ahora muestra:
- **Con rango:** `5 / 4 (5-8)` 
  - Página actual: 5
  - Total en rango: 4 páginas
  - Rango completo: páginas 5 a 8

- **Sin rango:** `5 / 120`
  - Página actual: 5
  - Total del PDF: 120 páginas

### Botones de Navegación
- Se deshabilitan automáticamente al llegar al inicio/fin del rango
- Feedback visual claro de las páginas disponibles

## 🚀 Próximas Mejoras Posibles

- [ ] Resaltar visualmente las páginas del rango en una vista de miniaturas
- [ ] Permitir editar el rango desde la sesión de práctica
- [ ] Mostrar marcadores visuales en las páginas del rango
- [ ] Agregar atajos de teclado (← → para navegar)
- [ ] Vista de todas las páginas del rango en una cuadrícula
- [ ] Zoom sincronizado entre páginas del rango

## ✅ Resumen

Ahora cuando practicas un ejercicio:
1. Solo ves las páginas que especificaste
2. La navegación es más rápida y enfocada
3. No te distraes con páginas irrelevantes
4. El indicador muestra claramente el rango activo

¡Disfruta de una práctica más enfocada y eficiente! 🎵
