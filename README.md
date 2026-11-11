# Simela Finance — Demo de gestión financiera

Demo funcional de un dashboard financiero para **Simela Salud Laboral**, pensada para una
presentación comercial en el marco de una iniciativa de innovación abierta.

> **Importante:** todos los datos son ficticios y están hardcodeados. La aplicación no se conecta a
> sistemas de Simela, no incluye backend, autenticación ni base de datos. No representa información
> real de la empresa.

## Qué incluye

- **Resumen general:** KPIs de ingresos, costos, cuentas por cobrar y resultado operativo;
  evolución financiera de 12 meses; composición de ingresos y costos; cartera pendiente y alertas.
- **Facturación:** total facturado, cantidad de facturas, ticket promedio, clientes facturados,
  evolución mensual por unidad de negocio y tabla de facturas filtrable y ordenable.
- **Costos y gastos:** total, costos fijos y variables, costo sobre facturación, evolución mensual,
  distribución por categoría y detalle de gastos con filtro por categoría.
- **Cuentas por cobrar:** saldo pendiente, vencido y a vencer; tasa de cobranza; antigüedad de la
  deuda; búsqueda y filtros de clientes; detalle de saldos y días de atraso.
- **Rentabilidad:** resultado y margen operativo, ingresos vs. costos, evolución del margen,
  ranking y detalle por unidad de negocio, y explicación visual de facturación / resultado / margen.
- **Transversal:** selector global de período (últimos 30 días, últimos 90 días, año 2026 y año 2025),
  exportación CSV en cada sección, diseño responsive, tooltips y navegación por rutas.

## Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Componentes de estilo shadcn/ui construidos sobre Tailwind
- Recharts 2
- Lucide React
- date-fns
- React Router 6

## Datos de demostración

El módulo `src/data/mock-data.ts` genera de forma determinística:

- 18 clientes ficticios.
- Más de 330 facturas entre 2024 y 2026.
- Más de 500 registros de costos y gastos.
- Tres unidades de negocio y cinco categorías de costos.

Toda la información se deriva de esas fuentes:

- Ingresos = suma de facturas emitidas en el período.
- Costos = suma de gastos registrados en el período.
- Resultado operativo = ingresos − costos.
- Margen operativo = resultado operativo / ingresos.
- Cuentas por cobrar = facturas impagas al cierre del período.
- Variaciones = comparación contra el período anterior equivalente.

Cada factura tiene una fecha de pago simulada, lo que permite calcular cortes históricos coherentes
para 2025 y 2026. Los costos compartidos se asignan a las unidades de negocio según su participación
en la facturación.

## Desarrollo local

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Validación

```bash
npm run typecheck
npm run verify:data
npm run build
npm run preview
```

`verify:data` comprueba la coherencia entre facturas, gastos, cartera, márgenes y rentabilidad por
unidad para todos los períodos disponibles.

## Despliegue en Vercel

El proyecto incluye `vercel.json` con la reescritura necesaria para que las rutas de React Router
funcionen al refrescar la página.

### Opción A — Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```

### Opción B — Desde el dashboard de Vercel

1. Subir el proyecto a GitHub.
2. Importar el repositorio en Vercel.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy.

## Git y GitHub

```bash
git init
git add .
git commit -m "feat: add Simela Finance demo dashboard"
git branch -M main
git remote add origin https://github.com/<usuario>/simela-finance-demo.git
git push -u origin main
```

Si GitHub CLI está disponible, se puede crear el repositorio directamente:

```bash
gh repo create simela-finance-demo --public --source=. --remote=origin --push
```

## Estructura

```text
src/
  components/
    charts/       Gráficos Recharts y tooltips
    common/       Encabezados, paginación, ordenamiento, estados
    dashboard/    KPIs, alertas, tarjetas de resumen
    layout/       Sidebar, header, layout y navegación
    ui/           Primitivas estilo shadcn/ui
  context/        Período global
  data/           Datos mock centralizados
  lib/            Cálculos, formato, CSV y utilidades
  pages/          Resumen, facturación, costos, cobranzas y rentabilidad
  types/          Tipos TypeScript compartidos
  App.tsx
  main.tsx
```
