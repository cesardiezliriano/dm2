# DM 2. Definición del Reto

## Descripción Corta (Menos de 300 caracteres)

App con IA para definir retos estratégicos de negocio usando el marco de Rumelt. Guía a los usuarios desde el diagnóstico hasta la generación de prompts para la ideación de acciones coherentes.

---

## Descripción Completa

### Acerca del Proyecto

Esta es una herramienta inteligente diseñada para estrategas, especialistas en marketing y líderes de negocio. Ayuda a transformar situaciones empresariales complejas en retos estratégicos claros y accionables. Al integrar el contexto proporcionado por el usuario con el análisis impulsado por IA, la aplicación agiliza la fase inicial y más crítica del desarrollo de la estrategia, garantizando claridad y enfoque.

### Metodología Central: "Buena Estrategia, Mala Estrategia" de Rumelt

La aplicación se basa en los principios de la obra fundamental de Richard Rumelt. Se centra en crear un **"Núcleo"** de una buena estrategia, que consta de tres componentes principales:

1.  **Un Diagnóstico:** Una explicación de la naturaleza del reto. Un buen diagnóstico simplifica la abrumadora complejidad de la realidad al identificar ciertos aspectos de la situación como críticos.
2.  **Una Política Guía:** Un enfoque general elegido para hacer frente o superar los obstáculos identificados en el diagnóstico.
3.  **Acciones Coherentes:** Pasos coordinados entre sí para apoyar la consecución de la política guía.

Esta aplicación automatiza y mejora la creación del Diagnóstico y la Política Guía, y proporciona prompts para la lluvia de ideas de Acciones Coherentes.

### Cómo Funciona

La aplicación guía al usuario a través de un proceso estructurado de cuatro pasos:

1.  **Paso 1: Diagnóstico Inicial**
    El usuario proporciona información detallada sobre el contexto del negocio, incluyendo detalles del cliente, panorama del mercado, perfiles de cliente, el problema central y el contexto del consumidor. La riqueza de esta información es crucial para la calidad del análisis de la IA.

2.  **Paso 2: Formulación del Reto Estratégico**
    Utilizando la IA Gemini de Google, la aplicación analiza los datos del diagnóstico para generar un **"Núcleo de Reto Estratégico"** completo. Esto incluye una propuesta de **Diagnóstico de Rumelt** y una **Política Guía**. La IA también enriquece este núcleo con:
    *   **Justificación Conductual:** Por qué la política debería funcionar basándose en principios de la psicología humana.
    *   **Tensión Cultural, Oportunidad de Mercado e Insight del Consumidor:** Factores contextuales clave que dan forma al reto.
    El usuario puede revisar y refinar todos los campos generados por la IA, combinando las ideas impulsadas por la IA con su propia experiencia.

3.  **Paso 3: Generación de Prompts Inteligentes**
    Basándose en el reto formulado, la IA genera un conjunto de prompts personalizados y abiertos. Están diseñados para impulsar sesiones de ideación para crear **"Acciones Coherentes"** (por ejemplo, campañas, características de productos, cambios en servicios) que estén perfectamente alineadas con la Política Guía.

4.  **Paso 4: Resumen y Exportación**
    El paso final proporciona un resumen completo de toda la sesión, desde el diagnóstico inicial hasta los prompts finales. Este resumen se puede copiar al portapapeles o descargar como un archivo Markdown (`.md`) para compartirlo y documentarlo fácilmente.

### Características Clave

*   **Flujo de Trabajo Guiado:** Un proceso paso a paso que simplifica la formulación estratégica.
*   **Análisis con IA:** Utiliza la API de Gemini de Google para generar insights estratégicos profundos basados en el marco de Rumelt.
*   **Interactivo y Editable:** Los usuarios pueden editar y refinar el contenido generado por la IA en cada paso.
*   **Soporte Bilingüe:** Totalmente disponible en inglés y español.
*   **Resumen Exportable:** Comparte fácilmente el resultado estratégico con las partes interesadas.

### Stack Tecnológico

*   **Frontend:** React, TypeScript, Tailwind CSS
*   **IA:** Google Gemini API (`@google/genai`)