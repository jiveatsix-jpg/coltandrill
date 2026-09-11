import { useEffect, useState } from 'react'
import type { ModuleMeta, ModuleId, TestPreset } from '../data/questions'
import { LEVEL_LABELS } from '../data/questions'
import { getAllTests, deleteTest } from '../data/library'

interface LibraryScreenProps {
  modules: ModuleMeta[]
  onBack: () => void
  onCreateModule: () => void
  onEditModule: (id: ModuleId) => void
  onDeleteModule: (id: ModuleId) => void
  onLoadTest: (test: TestPreset) => void
}

export function LibraryScreen({
  modules,
  onBack,
  onCreateModule,
  onEditModule,
  onDeleteModule,
  onLoadTest,
}: LibraryScreenProps) {
  const [tests, setTests] = useState<TestPreset[]>(() => getAllTests())
  const [confirmingModuleId, setConfirmingModuleId] = useState<ModuleId | null>(null)
  const [confirmingTestId, setConfirmingTestId] = useState<string | null>(null)

  useEffect(() => {
    setTests(getAllTests())
  }, [])

  const handleDelete = (mod: ModuleMeta) => {
    if (confirmingModuleId !== mod.id) {
      setConfirmingModuleId(mod.id)
      return
    }
    setConfirmingModuleId(null)
    onDeleteModule(mod.id)
  }

  const handleDeleteTest = (test: TestPreset) => {
    if (confirmingTestId !== test.id) {
      setConfirmingTestId(test.id)
      return
    }
    setConfirmingTestId(null)
    deleteTest(test.id)
    setTests(getAllTests())
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* ── Back ─────────────────────────────────────────── */}
      <button
        className="arcade-btn panel-bevel-sm font-mono text-[9px] px-4 py-2 self-start"
        style={{ width: 'fit-content' }}
        onClick={onBack}
      >
        ← VOLVER
      </button>

      <div>
        <p className="text-[9px] tracking-[0.4em] text-subtext font-mono uppercase mb-3">
          ▸ GESTIÓN DE MÓDULOS
        </p>

        <button
          id="create-module-btn"
          className="arcade-btn arcade-btn--primary panel-bevel-sm font-arcade text-[9px] py-4 w-full mb-4"
          onClick={onCreateModule}
        >
          + NUEVO MÓDULO
        </button>

        <div className="grid grid-cols-2 gap-3">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="panel-bevel-sm bg-surface border-2 border-subtext/20 flex-col items-start gap-1 py-3 px-3 text-left"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base leading-none">{mod.icon}</span>
                  <span className="text-[11px] font-arcade leading-tight truncate">{mod.label}</span>
                </div>
                {mod.origin === 'seed' && (
                  <span className="text-[7px] font-mono text-subtext border border-subtext/30 px-1 py-0.5 tracking-widest shrink-0">
                    SEMILLA
                  </span>
                )}
              </div>
              <span className="text-[12px] text-subtext font-mono leading-tight mt-1 normal-case opacity-70 block">
                {mod.description}
              </span>

              {mod.origin === 'user' && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-border/30">
                  <button
                    className="arcade-btn panel-bevel-sm font-arcade text-[7px] px-2 py-1.5 flex-1"
                    onClick={() => onEditModule(mod.id)}
                  >
                    EDITAR
                  </button>
                  <button
                    className={`arcade-btn panel-bevel-sm font-arcade text-[7px] px-2 py-1.5 flex-1 ${
                      confirmingModuleId === mod.id ? 'arcade-btn--danger-armed' : 'arcade-btn--danger'
                    }`}
                    onClick={() => handleDelete(mod)}
                  >
                    {confirmingModuleId === mod.id ? '¿SEGURO? BORRAR' : 'BORRAR'}
                  </button>
                  {confirmingModuleId === mod.id && (
                    <button
                      className="font-mono text-[7px] text-subtext underline shrink-0 px-1"
                      onClick={() => setConfirmingModuleId(null)}
                    >
                      cancelar
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[9px] tracking-[0.4em] text-subtext font-mono uppercase mb-3">
          ▸ TESTS GUARDADOS
        </p>

        {tests.length === 0 ? (
          <p className="text-[11px] text-subtext font-mono opacity-60 tracking-widest">
            — SIN TESTS GUARDADOS —
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {tests.map((test) => {
              const mod = modules.find((m) => m.id === test.moduleId)
              const subLabel = test.subcategory
                ? mod?.subcategories.find((s) => s.id === test.subcategory)?.label ?? test.subcategory
                : 'TODAS LAS ÁREAS'
              return (
                <div
                  key={test.id}
                  className="panel-bevel-sm bg-surface border-2 border-subtext/20 flex-col items-start gap-1 py-3 px-3 text-left"
                >
                  <span className="text-[11px] font-arcade leading-tight truncate block">{test.name}</span>
                  <span className="text-[11px] text-subtext font-mono leading-tight mt-1 normal-case opacity-70 block">
                    {mod ? mod.label : 'MÓDULO BORRADO'} — {LEVEL_LABELS[test.level]}
                  </span>
                  <span className="text-[11px] text-subtext font-mono leading-tight normal-case opacity-70 block">
                    {subLabel}
                  </span>

                  <div className="flex gap-2 mt-2 pt-2 border-t border-border/30 w-full">
                    <button
                      className="arcade-btn panel-bevel-sm font-arcade text-[7px] px-2 py-1.5 flex-1"
                      disabled={!mod}
                      onClick={() => mod && onLoadTest(test)}
                    >
                      CARGAR
                    </button>
                    <button
                      className={`arcade-btn panel-bevel-sm font-arcade text-[7px] px-2 py-1.5 flex-1 ${
                        confirmingTestId === test.id ? 'arcade-btn--danger-armed' : 'arcade-btn--danger'
                      }`}
                      onClick={() => handleDeleteTest(test)}
                    >
                      {confirmingTestId === test.id ? '¿SEGURO? BORRAR' : 'BORRAR'}
                    </button>
                    {confirmingTestId === test.id && (
                      <button
                        className="font-mono text-[7px] text-subtext underline shrink-0 px-1"
                        onClick={() => setConfirmingTestId(null)}
                      >
                        cancelar
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
