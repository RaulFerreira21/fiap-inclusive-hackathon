# 🔄 Como Reverter as Alterações

## ℹ️ Contexto
Merge realizado em: **18/02/2026 às 16:01:28**
- Branch mesclada: `header_footer` → `main`
- Tag de backup: `backup-before-merge-2026-02-18-160128`
- Tag de release: `v1.0.0-onboarding-dashboard`

---

## 🛡️ Opções de Reversão

### Opção 1: Reverter TUDO (volta ao estado anterior ao merge)
```bash
# Esta opção apaga TODAS as alterações feitas no merge
git reset --hard backup-before-merge-2026-02-18-160128

# Se você já fez push, vai precisar forçar:
git push origin main --force
```

⚠️ **ATENÇÃO**: Isso apaga permanentemente as alterações!

---

### Opção 2: Criar um commit de reversão (RECOMENDADO)
```bash
# Esta opção mantém o histórico e cria um novo commit revertendo
git revert HEAD

# Ou reverter commits específicos:
git revert 6892c70  # Reverte onboarding/dashboard
git revert 202f103  # Reverte header/footer
```

✅ **VANTAGEM**: Não apaga o histórico, apenas cria um commit reverso.

---

### Opção 3: Voltar temporariamente para testar
```bash
# Apenas visualizar como estava antes:
git checkout backup-before-merge-2026-02-18-160128

# Para voltar para a main atual:
git checkout main
```

---

## 📋 Alterações Incluídas no Merge

### Componentes Criados:
- ✅ HeaderComponent (Pomodoro + Modo Foco)
- ✅ FooterComponent
- ✅ OnboardingComponent (3 etapas)
- ✅ DashboardComponent (Kanban)

### Services Criados:
- ✅ PomodoroService
- ✅ AppStateService
- ✅ BoardService

### Total:
- **21 arquivos alterados**
- **+1707 linhas adicionadas**
- **-350 linhas removidas**

---

## 🔍 Verificar Estado Atual

```bash
# Ver em que commit você está
git log --oneline -5

# Ver diferenças com o backup
git diff backup-before-merge-2026-02-18-160128

# Ver todas as tags
git tag
```

---

## 💡 Dica para Seus Colegas

Se seus colegas quiserem apenas **testar** sem afetar o código deles:

```bash
# Eles podem criar uma branch de teste:
git checkout -b test-new-features main

# Testar tudo, e se não gostarem:
git checkout main
git branch -D test-new-features
```

---

## 📞 Suporte

Em caso de dúvidas ou problemas, você pode:
1. Verificar o histórico: `git log --graph --oneline --all`
2. Ver os arquivos alterados: `git diff backup-before-merge-2026-02-18-160128..HEAD --name-only`
3. Restaurar arquivo específico: `git checkout backup-before-merge-2026-02-18-160128 -- caminho/do/arquivo`
