# Implementar um Design System completo com Next.js, React, TypeScript e Tailwind CSS

## Objetivo

Implemente do zero um design system completo, consistente, acessível e visualmente marcante, utilizando Next.js, React, TypeScript e Tailwind CSS.

O resultado deve ser uma aplicação funcional que sirva simultaneamente como:
- Biblioteca reutilizável de componentes.
- Playground interativo para experimentar variantes e propriedades.
- Documentação técnica com exemplos e código copiável.
- Base arquitetural preparada para uma futura extração dos componentes para uma biblioteca independente.

**Não crie apenas um protótipo visual ou uma landing page. Implemente os componentes reais, suas interações, os tokens, os estados, a acessibilidade e a documentação.**

## 1. Stack e restrições

- Next.js com App Router.
- React e TypeScript com tipagem estrita.
- Tailwind CSS.
- CSS variables para os tokens de design e os temas.
- Lucide React para ícones.
- Utilize a infraestrutura de testes adequada ao projeto, preferencialmente Vitest e React Testing Library.
- Utilize ferramentas auxiliares pequenas quando necessário para acessibilidade, posicionamento de elementos flutuantes ou animações.

Implemente os componentes visuais do zero. Não utilize bibliotecas prontas de componentes visuais como shadcn/ui, MUI, Chakra UI, Ant Design ou equivalentes.

Bibliotecas utilitárias podem ser utilizadas quando justificadas, mas não devem substituir a implementação dos componentes centrais.

Antes de modificar o projeto, inspecione sua estrutura, `package.json`, versões instaladas, configurações existentes e convenções. Preserve o que já estiver funcionando e adapte a implementação à versão real do Tailwind e do Next.js encontrada.

## 2. Direção visual

Crie uma identidade visual contemporânea, expressiva, acolhedora e sofisticada, inspirada em interfaces editoriais modernas e ferramentas de design profissionais.

### Paleta e superfícies

- Base escura em charcoal, próxima de um preto suave, evitando preto absoluto em todas as superfícies.
- Lavanda como cor de destaque principal.
- Paleta equilibrada: expressiva sem saturação excessiva.
- Superfícies-base discretas, com contraste suficiente para organizar a interface.
- Cards de destaque com cores e gradientes seletivos.
- Gradientes reservados para elementos importantes, como destaques, métricas ou demonstrações de variantes.
- Estados de sucesso, aviso, erro e informação com cores semânticas distintas e acessíveis.
- Bordas sutis, divisores discretos e sombras cuidadosamente dosadas.

Implemente também o tema claro completo. Não basta inverter o fundo: textos, bordas, campos, menus, overlays, gráficos e estados devem permanecer legíveis e visualmente coerentes nos dois temas.

### Tipografia

Utilize uma tipografia editorial e expressiva nos títulos, combinada com uma fonte funcional e altamente legível nos textos e controles.

Considere Geist ou Manrope para a identidade tipográfica, escolhendo uma combinação consistente. Estabeleça uma escala tipográfica com tamanhos, pesos, alturas de linha e espaçamentos padronizados.

### Formas

- Cantos generosamente arredondados nos cards e contêineres.
- Botões arredondados e pills quando fizerem sentido para a identidade visual.
- Campos e controles com bordas e estados de foco discretos.
- Sidebar flutuante, visualmente integrada ao restante da interface.
- Hierarquia clara entre superfícies, sem transformar tudo em cards idênticos.

### Movimento

Implemente animações fluidas e orgânicas, sem comprometer a usabilidade:

- Transições sutis de hover e focus.
- Feedback visual de clique.
- Abertura e fechamento animados de menus, dialogs e drawers.
- Transições discretas entre estados e variantes.
- Animações suaves nos exemplos do playground.

Respeite `prefers-reduced-motion`. Evite animações excessivas, movimentos que prejudiquem a leitura e dependência de animações para comunicar informações importantes.

## 3. Design tokens em camadas

Construa uma arquitetura de tokens escalável, organizada em três camadas.

### Primitives

Valores fundamentais independentes do contexto semântico:

- Cores e escalas tonais.
- Espaçamentos.
- Raios de borda.
- Tipografia.
- Pesos e alturas de linha.
- Sombras.
- Opacidades.
- Durações e curvas de animação.
- Breakpoints.
- Camadas de elevação e z-index.

### Semantic tokens

Tokens que expressam intenção, com suporte aos temas claro e escuro:

- `background`, `foreground`.
- `surface`, `surface-elevated`.
- `primary`, `primary-foreground`.
- `secondary`, `secondary-foreground`.
- `muted`, `muted-foreground`.
- `accent`, `accent-foreground`.
- `border`, `input`, `ring`.
- `success`, `warning`, `destructive`, `info`.
- Tokens para gráficos, overlays e estados interativos.

Os nomes acima são referências conceituais. Adapte-os de maneira consistente à convenção escolhida.

### Component tokens

Permita personalizar componentes individualmente quando houver necessidade real, sem duplicar desnecessariamente os tokens semânticos.

Todos os componentes devem consumir os tokens definidos pelo sistema. Evite valores de cores, raios ou espaçamentos espalhados arbitrariamente pelos arquivos.

Utilize CSS variables como fonte principal dos valores semânticos, integradas ao Tailwind. Documente a relação entre primitives, tokens semânticos e tokens de componentes.

## 4. Temas

Implemente três modos internos de seleção:

- `system`: acompanha a preferência do sistema operacional.
- `light`: força o tema claro.
- `dark`: força o tema escuro.

O padrão inicial deve ser `system`.

Adicione uma alternância de tema persistente e acessível na interface. A escolha manual deve ser preservada entre sessões e prevalecer sobre a preferência do sistema até que o usuário volte ao modo `system`.

Evite flash de tema incorreto durante o carregamento inicial. Considere SSR, hidratação, persistência e mudanças na preferência do sistema.

O playground também deve oferecer uma forma de visualizar os componentes em claro e escuro para fins de comparação, sem alterar acidentalmente a preferência global.

## 5. Arquitetura do projeto

Implemente tudo inicialmente em uma única aplicação Next.js, organizada para futura extração da biblioteca sem exigir reescrita dos componentes.

Estruture o código por responsabilidades. Uma referência possível:

- `app/`: rotas, layouts e páginas da aplicação.
- `components/ui/`: componentes reutilizáveis do design system.
- `components/layout/`: sidebar, navegação e estruturas da documentação.
- `components/playground/`: controles, preview e ferramentas interativas.
- `tokens/`: primitives, tokens semânticos e configurações de tema.
- `hooks/`: hooks reutilizáveis.
- `lib/`: utilitários e helpers compartilhados.
- `types/`: tipos compartilhados quando necessário.
- `tests/`: testes de componentes e fluxos críticos.

Ajuste a estrutura conforme as convenções já existentes no projeto. Evite abstrações desnecessárias, arquivos gigantes e componentes excessivamente acoplados à aplicação de documentação.

Os componentes centrais devem poder ser reutilizados em outra aplicação sem depender da sidebar, do playground ou de rotas específicas.

## 6. Layout da aplicação

Crie uma aplicação de documentação e demonstração com:

- Sidebar flutuante, arredondada e visualmente distinta.
- Navegação lateral persistente, com possibilidade de recolher e expandir.
- Cabeçalho funcional com identificação da seção atual.
- Alternância de tema.
- Área principal com hierarquia editorial bem definida.
- Navegação clara entre categorias e componentes.
- Layout responsivo para desktop, tablet e celular.
- Estados de carregamento e de navegação bem tratados.

Organize a navegação por categorias, por exemplo:

- Foundations.
- Layout.
- Actions.
- Forms.
- Data Display.
- Feedback.
- Overlays.
- Navigation.

O layout deve ser consistente entre as páginas, mas permitir que cada categoria e componente tenha uma apresentação apropriada.

## 7. Biblioteca de componentes

Implemente componentes reais, funcionais e tipados, com variantes, tamanhos, estados e propriedades coerentes.

### Foundations e layout

- Container.
- Stack e agrupamentos de layout.
- Separator.
- Surface e Card.
- Badge e Chip.
- Avatar.
- Tooltip.
- Ícones e helpers de ícones.
- Skeleton.
- Empty State.

### Actions

- Button.
- Icon Button.
- Button Group.
- Toggle.
- Toggle Group.
- Dropdown Menu.
- Context Menu, se aplicável.

### Forms

- Input.
- Textarea.
- Select.
- Combobox com busca.
- Checkbox.
- Radio Group.
- Switch.
- Slider.
- Form Field.
- Label.
- Helper Text.
- Mensagens de erro e validação.

Os campos devem contemplar estados de foco, preenchimento, desabilitado, somente leitura, inválido e carregamento quando aplicáveis.

### Data Display

- Table.
- Data Table com ordenação e seleção quando aplicáveis.
- Pagination.
- Tabs.
- Accordion.
- Progress.
- Meter.
- Calendar ou Date Picker, se viável sem comprometer a qualidade dos componentes essenciais.
- Elementos de apresentação de métricas.

### Feedback

- Alert.
- Inline Message.
- Toast e sistema de notificações.
- Progress Indicator.
- Loading State.
- Error State.
- Success State.
- Empty State.

### Overlays

- Dialog.
- Alert Dialog.
- Drawer.
- Popover.
- Tooltip.
- Command Palette, se viável.

### Navegação

- Sidebar Navigation.
- Breadcrumb.
- Navigation Menu.
- Tabs de navegação.
- Pagination.
- Workspace ou seção de navegação, se fizer sentido para os exemplos.

Não implemente dezenas de componentes superficialmente. Priorize uma base consistente, componentes centrais completos e APIs previsíveis. Componentes opcionais podem ser desenvolvidos após os essenciais, mas a arquitetura deve permitir sua adição.

## 8. Requisitos de qualidade dos componentes

Cada componente deve:

- Ser escrito em TypeScript com interfaces de props explícitas.
- Expor variantes e tamanhos consistentes.
- Ter defaults sensatos.
- Aceitar `className` quando isso for útil para composição.
- Preservar propriedades HTML e atributos ARIA aplicáveis.
- Permitir composição com outros componentes.
- Utilizar tokens em vez de valores visuais arbitrários.
- Ter comportamento responsivo quando pertinente.
- Exibir corretamente seus estados interativos.
- Evitar dependências desnecessárias de contexto global.
- Ser testável isoladamente.

Use uma API de variantes consistente entre componentes, com nomes previsíveis como `variant`, `size`, `disabled`, `loading` e `className`, quando aplicáveis.

Utilize `forwardRef` apenas quando necessário e de acordo com as convenções da versão do React adotada. Não adicione complexidade por padrão.

## 9. Acessibilidade

A acessibilidade é um requisito de implementação, não uma etapa cosmética posterior.

Implemente e valide:

- Navegação completa por teclado.
- Indicadores de foco visíveis.
- Ordem de tabulação coerente.
- Labels associados aos campos.
- Contraste adequado nos dois temas.
- Nomes acessíveis para controles somente com ícones.
- Estados ARIA corretos.
- Semântica HTML apropriada.
- Gerenciamento de foco em dialogs e drawers.
- Fechamento por Escape quando apropriado.
- Retorno do foco ao elemento de origem.
- Navegação por teclado em menus, listas e seletores.
- Mensagens de erro compreensíveis.
- Suporte a leitores de tela.
- Respeito à preferência por movimento reduzido.

Não simule acessibilidade apenas adicionando atributos ARIA. Prefira elementos nativos sempre que possível e implemente o comportamento de teclado exigido pelos padrões de cada componente.

Teste especialmente Dialog, Alert Dialog, Dropdown Menu, Select, Combobox, Tooltip, Tabs e os componentes de formulário.

## 10. Playground interativo

O playground é uma parte central da aplicação.

Para cada componente, ofereça, conforme aplicável:

- Preview real e interativo.
- Controles para experimentar propriedades.
- Seleção de variantes e tamanhos.
- Alternância de estados.
- Campos para editar textos e valores.
- Visualização em tema claro e escuro.
- Exemplos de uso realistas.
- Código-fonte copiável.
- Indicação das propriedades utilizadas no exemplo.

Os controles devem alterar efetivamente o preview. Não crie botões decorativos ou controles sem comportamento.

O código apresentado deve refletir o exemplo atual sempre que isso for tecnicamente viável. Ao copiar, a ação deve realmente colocar o conteúdo na área de transferência e oferecer feedback visual acessível.

Para componentes complexos, apresente exemplos separados de uso básico, composição e estados relevantes.

## 11. Documentação técnica

Cada página de componente deve incluir:

1. Descrição e finalidade.
2. Preview interativo.
3. Variantes e tamanhos.
4. Estados e comportamentos.
5. Exemplo de código.
6. Referência das principais props.
7. Exemplos de composição.
8. Orientações de acessibilidade relevantes.
9. Recomendações de uso e limitações quando necessário.

Mantenha a documentação proporcional à complexidade de cada componente. Não transforme componentes simples em páginas desnecessariamente extensas.

A documentação deve corresponder ao código realmente implementado.

## 12. Qualidade visual

O resultado deve parecer um produto de design profissional, não um painel administrativo genérico.

Evite:

- Estética excessivamente corporativa.
- Uso de gradientes em todos os elementos.
- Cards repetidos sem hierarquia visual.
- Bordas fortes em todos os componentes.
- Cores arbitrárias e inconsistentes.
- Tipografia pequena ou pouco contrastante.
- Espaçamento irregular.
- Elementos decorativos sem função.
- Placeholders que não demonstram o componente.
- Conteúdo de demonstração repetitivo.
- Controles com aparência interativa que não funcionam.

Invista em hierarquia tipográfica, ritmo de espaçamento, composição, contraste, estados de interação e consistência visual.

Use exemplos de conteúdo plausíveis. Os exemplos devem demonstrar como os componentes se comportam em situações reais, e não apenas mostrar formas vazias.

## 13. Testes e validação

Implemente testes para os componentes mais importantes, especialmente:

- Variantes e estados dos botões.
- Campos de formulário e mensagens de validação.
- Select e Combobox.
- Dropdown Menu.
- Dialog e Alert Dialog.
- Tabs e Accordion.
- Toast e notificações.
- Alternância e persistência de tema.
- Navegação principal e comportamento responsivo.

Execute os scripts disponíveis para lint, type checking, testes e build. Corrija os erros introduzidos pela implementação.

Não declare que os testes passaram se não tiver executado os comandos correspondentes.

## 14. Estratégia de implementação

Trabalhe em etapas, mantendo a aplicação funcional ao longo do desenvolvimento:

1. Inspecione o projeto e identifique a stack e as configurações reais.
2. Defina os tokens, os temas e os fundamentos visuais.
3. Construa o layout da documentação e a navegação.
4. Implemente os componentes básicos e as utilidades compartilhadas.
5. Desenvolva os componentes de formulário e os padrões interativos complexos.
6. Implemente data display, feedback e overlays.
7. Desenvolva o playground interativo e os exemplos de código copiável.
8. Complete a documentação e os exemplos.
9. Adicione e execute os testes.
10. Execute lint, type checking e build; corrija os problemas encontrados.

Priorize os componentes e as dependências fundamentais antes de avançar para os componentes mais complexos.

Se o escopo exceder uma única etapa de execução, continue em incrementos funcionais, registrando o que foi concluído e o que ainda falta. Não substitua a implementação por uma lista de tarefas ou por exemplos conceituais.

## 15. Critérios de conclusão

Considere a implementação concluída quando:

- A aplicação inicia e compila.
- Os temas claro, escuro e sistema funcionam corretamente.
- A preferência manual persiste entre sessões.
- Os tokens estão organizados em camadas e são consumidos pelos componentes.
- A biblioteca apresenta uma identidade visual consistente.
- Os componentes essenciais possuem estados e interações reais.
- A navegação e o playground são funcionais.
- Os exemplos de código podem ser copiados.
- A documentação corresponde à implementação.
- Os componentes críticos de acessibilidade foram testados.
- Não existem erros de TypeScript ou build introduzidos pela implementação.
- A arquitetura mantém os componentes desacoplados das páginas de documentação.

Ao finalizar, apresente um resumo do que foi implementado, a estrutura principal criada, os comandos executados, os resultados reais das verificações e eventuais limitações restantes.

**Comece inspecionando o projeto existente e implemente diretamente nele. Tome decisões técnicas razoáveis sem interromper o trabalho para fazer uma longa sequência de perguntas.**