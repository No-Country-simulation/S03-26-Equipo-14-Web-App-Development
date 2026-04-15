# @team14/cms-library

Librería de componentes React para embeber testimonios en sitios de terceros. Publicada en npm vía GitHub Actions desde la rama `cms-package`.

---

## Instalación

```bash
npm install @team14/cms-library
# o
pnpm add @team14/cms-library
```

### Dependencias requeridas (peer dependencies)

```bash
npm install react react-dom framer-motion
```

---

## Uso

```tsx
import { TestimonialCarrousel } from '@team14/cms-library'
import '@team14/cms-library/dist/style.css'

export default function Page() {
  return (
    <TestimonialCarrousel
      apiKey="tu-api-key"
      length={3}
    />
  )
}
```

---

## Props

| Prop        | Tipo     | Requerido | Default | Descripción                                      |
|-------------|----------|-----------|---------|--------------------------------------------------|
| `apiKey`    | `string` | ✅        | —       | Clave de autenticación para obtener testimonios  |
| `length`    | `number` | ❌        | `2`     | Cantidad máxima de testimonios a mostrar         |
| `className` | `string` | ❌        | —       | Clase CSS adicional para el contenedor           |

---

## Estilos

El componente utiliza variables CSS de [shadcn/ui](https://ui.shadcn.com/). Si tu proyecto ya usa shadcn, los estilos se integran automáticamente con tu tema.

Si no usás shadcn, definí las siguientes variables en tu CSS global:

```css
:root {
  --primary: 221 83% 53%;
  --border: 214 32% 91%;
  --card: 0 0% 100%;
  --accent: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
}
```

Además, importá el CSS de la librería una vez en tu app:

```ts
import '@team14/cms-library/dist/style.css'
```

---

## Tipos de testimonios soportados

El componente detecta automáticamente el tipo de cada testimonio y renderiza la card correspondiente:

| Tipo      | Descripción              |
|-----------|--------------------------|
| `quote`   | Testimonio de texto      |
| `video`   | Testimonio en video      |
| `case`    | Caso de estudio          |

---

## Publicación

La librería se publica automáticamente a npm mediante GitHub Actions al hacer push a la rama `cms-package`, siempre que haya cambios en `packages/cms-library`.

El workflow se encuentra en `.github/workflows/release-cms-library.yml`.

### Publicar una nueva versión

1. Realizá tus cambios en la librería
2. Commiteá los cambios
3. Desde la raíz del monorepo, ejecutá el script de release indicando el tipo de cambio:

```bash
pnpm release patch   # bug fixes, cambios internos → 0.1.2 → 0.1.3
pnpm release minor   # nueva funcionalidad          → 0.1.2 → 0.2.0
pnpm release major   # cambios que rompen la API    → 0.1.2 → 1.0.0
```

El script automáticamente:
- Bumea la versión en `package.json`
- Crea un commit con el mensaje `chore: release vX.X.X`
- Pushea a `cms-package`
- Dispara el workflow de publicación en GitHub Actions

---

## Desarrollo local

```bash
cd packages/cms-library
pnpm install
pnpm dev
```

Esto levanta el entorno de desarrollo en `http://localhost:5173` usando la carpeta `dev/` como app de prueba.

Para buildear la librería:

```bash
pnpm build
```