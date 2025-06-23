# Ateneo - Frontend de Carga de Documentos

Una aplicación React moderna para cargar documentos que se procesarán mediante un pipeline de datos con Kafka y Flink.

## 🚀 Características

### ✨ Nuevas Mejoras (v2.0)

- **UI Mejorada para Muchos Archivos**: Manejo eficiente de grandes cantidades de archivos
- **Paginación**: Navegación fácil entre archivos (10 archivos por página)
- **Filtrado por Estado**: Filtra archivos por estado (todos, en cola, subiendo, enviados, errores)
- **Gestión de Archivos**: Elimina archivos individuales antes de subirlos
- **Estadísticas en Tiempo Real**: Resumen visual del estado de todos los archivos
- **Mejor Visualización**: Iconos por tipo de archivo y información detallada
- **Nombres de Archivos Corregidos**: Se preservan correctamente los nombres después de subir
- **Responsive Design**: Optimizado para dispositivos móviles

### 📁 Tipos de Archivo Soportados

- **PDF** (`.pdf`) 📄
- **Word** (`.docx`) 📝  
- **Texto plano** (`.txt`) 📄
- **HTML** (`.html`, `.htm`) 🌐
- **Markdown** (`.md`) 📋

### 🎯 Funcionalidades Principales

- **Drag & Drop**: Arrastra archivos directamente a la zona de carga
- **Carga Múltiple**: Selecciona y sube múltiples archivos a la vez
- **Estados de Archivo**: Seguimiento en tiempo real del estado de cada archivo
- **Gestión de Errores**: Manejo robusto de errores con mensajes descriptivos
- **Limpieza de Sesión**: Borra todos los archivos de la sesión actual

## 🛠️ Configuración

### Prerrequisitos

- Node.js (v14 o superior)
- npm o yarn

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd services-front
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` y configura:
   ```env
   REACT_APP_API_GATEWAY_URL=http://localhost:8000
   ```

4. **Inicia la aplicación**
   ```bash
   npm start
   ```

   La aplicación estará disponible en `http://localhost:3000`

## 🔧 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm eject` - Expone la configuración de Create React App

## 🏗️ Arquitectura

### Componentes Principales

- **App.js**: Componente principal con lógica de carga y gestión de estado
- **Dropzone**: Zona de arrastrar y soltar archivos
- **FileList**: Lista paginada de archivos con filtrado
- **StatusIndicators**: Indicadores visuales del estado de carga

### Estados de Archivo

1. **En Cola** (`queued`) - Archivo listo para subir
2. **Subiendo** (`uploading`) - Archivo en proceso de carga
3. **Enviado** (`success`) - Archivo procesado exitosamente
4. **Error** (`error`) - Error durante la carga

### API Integration

La aplicación se conecta al API Gateway mediante:

- **Endpoint**: `POST /api/v1/ingest/upload`
- **Headers**: `X-Company-ID` (UUID de la empresa)
- **Formato**: multipart/form-data

## 🎨 Personalización

### Estilos

Los estilos están en `src/App.css` y incluyen:

- **Variables CSS**: Para fácil personalización de colores
- **Responsive Design**: Breakpoints para móviles y tablets
- **Animaciones**: Transiciones suaves y efectos visuales
- **Themes**: Sistema de colores consistente

### Configuración de Archivos

Modifica el objeto `accept` en `useDropzone` para cambiar los tipos de archivo permitidos:

```javascript
accept: {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  // Agrega más tipos aquí
}
```

## 🐛 Solución de Problemas

### Error "NaN undefined"

✅ **Solucionado**: La función `humanFileSize` ahora maneja correctamente valores `null`, `undefined` y no numéricos.

### Nombres de archivos no se muestran

✅ **Solucionado**: Los nombres se preservan correctamente en el estado del componente.

### Performance con muchos archivos

✅ **Solucionado**: Implementada paginación y filtrado para manejar grandes cantidades de archivos.

## 📦 Dependencias Principales

- **React** (v19.1.0) - Framework principal
- **react-dropzone** (v14.2.3) - Componente drag & drop
- **axios** (v1.7.2) - Cliente HTTP
- **react-scripts** (v5.0.1) - Herramientas de desarrollo

## 🚀 Despliegue

### Build de Producción

```bash
npm run build
```

Esto creará una carpeta `build/` con los archivos optimizados para producción.

### Variables de Entorno para Producción

```env
REACT_APP_API_GATEWAY_URL=https://tu-api-production.com
```

## 🤝 Contribución

1. Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.