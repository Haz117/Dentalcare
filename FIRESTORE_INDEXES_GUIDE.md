# Configuración de Índices de Firestore

## 📋 Índices Necesarios para DentalCare

### 1. Índices para Citas (Appointments)

#### Índice Compuesto: userId + date
```
Colección: appointments
Campos: 
  - userId (Ascending)
  - date (Ascending)
```
**Uso**: Obtener todas las citas de un usuario ordenadas por fecha

#### Índice Compuesto: userId + status + date  
```
Colección: appointments
Campos:
  - userId (Ascending) 
  - status (Ascending)
  - date (Ascending)
```
**Uso**: Obtener citas de un usuario filtradas por estado

#### Índice Compuesto: date + time
```
Colección: appointments
Campos:
  - date (Ascending)
  - time (Ascending)  
```
**Uso**: Verificar disponibilidad de horarios

#### Índice Compuesto: status + date
```
Colección: appointments
Campos:
  - status (Ascending)
  - date (Ascending)
```
**Uso**: Dashboard administrativo - citas por estado

### 2. Índices para Usuarios (Users)

#### Índice Simple: email
```
Colección: users
Campo: email (Ascending)
```
**Uso**: Búsqueda rápida por email

#### Índice Simple: createdAt
```
Colección: users  
Campo: createdAt (Descending)
```
**Uso**: Usuarios ordenados por fecha de registro

### 3. Índices para Horarios Disponibles

#### Índice Compuesto: date + available
```
Colección: available_slots
Campos:
  - date (Ascending)
  - available (Ascending)
```
**Uso**: Obtener horarios disponibles por fecha

## 🔧 Cómo Configurar los Índices

### Método 1: Firebase Console (Recomendado)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **dentalcare-3b2ef**
3. Ve a **"Firestore Database"** > **"Indexes"**
4. Haz clic en **"Create Index"**
5. Configura cada índice según las especificaciones arriba

### Método 2: Firebase CLI

1. Instala Firebase CLI si no lo tienes:
```bash
npm install -g firebase-tools
```

2. Inicia sesión:
```bash
firebase login
```

3. Inicializa tu proyecto:
```bash
firebase init firestore
```

4. Usa el archivo `firestore.indexes.json` (ver abajo)

### Método 3: Archivo de Configuración

Crea el archivo `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "appointments",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "date", 
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "appointments",
      "queryScope": "COLLECTION", 
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "date",
          "order": "ASCENDING"  
        }
      ]
    },
    {
      "collectionGroup": "appointments",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "date",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "time", 
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "appointments", 
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "date",
          "order": "ASCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### Desplegar Índices:
```bash
firebase deploy --only firestore:indexes
```

## ⚡ Consultas Optimizadas

### Ejemplos de Consultas que Usarán estos Índices:

```javascript
// 1. Citas de un usuario ordenadas por fecha
const userAppointments = query(
  collection(db, 'appointments'),
  where('userId', '==', userId),
  orderBy('date', 'asc')
);

// 2. Citas pendientes de un usuario
const pendingAppointments = query(
  collection(db, 'appointments'), 
  where('userId', '==', userId),
  where('status', '==', 'pending'),
  orderBy('date', 'asc')
);

// 3. Verificar disponibilidad de horario
const timeSlotCheck = query(
  collection(db, 'appointments'),
  where('date', '==', selectedDate),
  where('time', '==', selectedTime)
);

// 4. Dashboard admin - citas confirmadas
const confirmedAppointments = query(
  collection(db, 'appointments'),
  where('status', '==', 'confirmed'), 
  orderBy('date', 'asc')
);
```

## 📊 Monitoreo de Rendimiento

### En Firebase Console:
1. Ve a **"Performance"** en el menú lateral
2. Revisa métricas de consultas lentas
3. Identifica consultas que necesitan índices

### Alertas de Rendimiento:
- Configura alertas para consultas > 1 segundo
- Monitorea uso de índices en **"Usage"**
- Revisa costos en **"Usage and billing"**

## ⚠️ Consideraciones Importantes

### Límites de Índices:
- Máximo 200 índices compuestos por base de datos
- Máximo 100 campos por índice compuesto
- Los índices simples son ilimitados

### Costos:
- Los índices consumen espacio de almacenamiento
- Cada escritura actualiza todos los índices relevantes
- Monitorea el crecimiento del almacenamiento

### Mejores Prácticas:
1. **Crea índices solo cuando los necesites**
2. **Elimina índices no utilizados**
3. **Combina filtros cuando sea posible**
4. **Usa límites en las consultas**
5. **Implementa paginación para listas grandes**

## 🔍 Debugging de Índices

### Si una consulta falla:
1. Revisa el error en la consola del navegador
2. Ve a Firebase Console > Firestore > Indexes
3. Busca el enlace para crear el índice automáticamente
4. Espera a que el índice se construya (puede tomar tiempo)

### Herramientas útiles:
- **Firebase Emulator**: Prueba local sin costos
- **Firestore Rules Playground**: Prueba reglas sin desplegar
- **Firebase CLI**: Administración desde terminal