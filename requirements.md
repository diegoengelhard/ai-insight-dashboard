# Creador de Dashboards con IA "Análisis al Instante"

## Visión del Proyecto

Crear una aplicación web que le permita a cualquier usuario convertirse en un analista de
datos. El usuario podrá subir una hoja de cálculo (.xlsx o .csv), y la aplicación usará
Inteligencia Artificial para analizar los datos, sugerir visualizaciones impactantes y ayudarle a
construir un dashboard simple y elegante en segundos.

## El Problema Central

Innumerables profesionales tienen datos valiosos atrapados en hojas de cálculo, pero carecen
del tiempo o la experiencia para explorarlos. Esta herramienta cerrará esa brecha,
proporcionando análisis instantáneos impulsados por IA sin necesidad de un software de BI
(Business Intelligence) complejo.

## Características y Requisitos Clave

1. **Frontend (React):**
    ○ Construye una interfaz de usuario (UI) limpia, moderna e intuitiva. Una
       _single-page application_ es perfecta para esto.
    ○ Implementa un componente para subir archivos (la funcionalidad de
       _drag-and-drop_ es un plus) que acepte formatos .xlsx y .csv.
    ○ Mientras el backend procesa el archivo, muestra un estado de carga atractivo
       que le informe al usuario que la IA está "analizando sus datos".
    ○ Una vez que el análisis esté completo, muestra las sugerencias generadas por la
       IA como "Tarjetas de Análisis" interactivas. Cada tarjeta debe contener:
          ■ El título del gráfico sugerido (ej. "Distribución de Ventas por Región").
          ■ Un **análisis breve generado por la IA** (ej. "Este gráfico revela que la
             región 'Norte' es la de mayor rendimiento.").
          ■ Un botón de "Agregar al Dashboard".
    ○ Crea una cuadrícula de dashboard flexible donde se rendericen los gráficos
       seleccionados. Usa una librería de gráficos como **Recharts, Chart.js, o D**.
2. **Backend (Python - usando Flask o FastAPI):**
    ○ Desarrolla un endpoint de API robusto para la carga de archivos. Utiliza la
       librería **pandas** para procesar la hoja de cálculo y convertirla en un DataFrame.
    ○ Implementa la lógica central de IA:
       ■ Del DataFrame, extrae los nombres de las columnas, los tipos de datos y
          un resumen estadístico (ej. usando df.describe() y df.info()).
       ■ Envía este esquema y resumen a un Modelo de Lenguaje Grande (LLM).


```
■ Diseña el prompt para la IA para que actúe como un analista de datos
experto. Pídele que identifique los patrones o relaciones más
interesantes en los datos y sugiera de 3 a 5 visualizaciones específicas
para destacarlos.
■ La IA debe devolver un arreglo JSON estructurado. Cada objeto en el
arreglo representará un gráfico sugerido y contendrá las siguientes
claves: title, chart_type (ej. bar, line, pie, scatter),
parameters (un objeto que especifique las columnas a usar, como
{"x_axis": "Categoría", "y_axis": "Valor"}), y un breve
insight (análisis) en formato de texto.
○ Crea un segundo endpoint que el frontend pueda llamar para obtener los datos
necesarios para un gráfico específico. Este endpoint recibirá los parameters
del gráfico y devolverá los datos ya agregados y formateados, listos para ser
visualizados. Esto evita enviar todo el conjunto de datos crudos al cliente.
```
## Criterios de Evaluación

```
● Velocidad y Herramientas Modernas: Te animamos encarecidamente a que uses
herramientas modernas y asistidas por IA para construir esto lo más rápido posible.
Aprovecha v0 de Vercel para generar componentes de UI y usa un editor de código
nativo de IA como Cursor para escribir y depurar código más rápido. El objetivo es ver
cuán eficazmente puedes construir un prototipo funcional.
● Integración de IA e Ingeniería de Prompts: La magia de esta aplicación reside en la
IA. ¿Qué tan bien diseñas el prompt para obtener sugerencias estructuradas, útiles y
perspicaces de manera consistente? La calidad del texto de insight generado es un
diferenciador clave.
● Arquitectura Full-Stack: Buscamos una aplicación limpia y bien estructurada, con una
clara separación de responsabilidades entre el frontend de React y el backend de
Python. El diseño de la API debe ser lógico y eficiente.
● Experiencia de Usuario (UX): El proceso completo, desde que se sube un archivo
hasta que se ve un dashboard interactivo, debe sentirse fluido, rápido y gratificante para
el usuario.
```
## Instrucciones de Entrega

1. Proporciona un enlace a un repositorio público de GitHub con tu código fuente
    completo.
2. Incluye un archivo README.md que explique claramente:
    ○ Cómo configurar y ejecutar el proyecto localmente.
    ○ Las decisiones técnicas que tomaste (ej. librerías, frameworks).
    ○ Tu enfoque para la ingeniería de _prompts_ para la IA.