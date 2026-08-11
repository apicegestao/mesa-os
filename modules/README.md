# Módulos

Os módulos de negócio serão adicionados somente quando houver Feature Spec e autorização no `docs/10-CURRENT-SCOPE.md`.

Cada módulo deverá conter suas interfaces públicas, domínio, aplicação, infraestrutura e UI conforme a necessidade real. Importações entre módulos devem ocorrer pela interface pública; `src/shared` contém apenas capacidades transversais, sem regras de negócio.
