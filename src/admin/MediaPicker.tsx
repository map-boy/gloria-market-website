import { useRef, useState, type DragEvent } from 'react'
import { ImagePlus, Star, Trash2, Upload } from 'lucide-react'
import { MAX_UPLOAD_MB, deleteMedia, uploadMedia } from '../lib/storage'
import type { MediaItem } from '../types'
import MediaFrame from '../components/MediaFrame'
import { useToast } from './Toast'

interface Props {
  value: MediaItem[]
  onChange: (next: MediaItem[]) => void
  /** Storage folder, e.g. `products/<id>`. */
  folder: string
  /** Images only (logos, icons) or pictures and videos. */
  accept?: 'image' | 'media'
  /** 1 turns the picker into a single-slot replace field. */
  max?: number
  hint?: string
}

export default function MediaPicker({ value, onChange, folder, accept = 'media', max = 12, hint }: Props) {
  const [progress, setProgress] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const single = max === 1
  const acceptAttr = accept === 'image' ? 'image/*' : 'image/*,video/*'

  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.from(files)
    if (list.length === 0) return

    const room = max - (single ? 0 : value.length)
    if (room <= 0) {
      toast(`You can add up to ${max} files here.`, 'error')
      return
    }

    const uploaded: MediaItem[] = []
    try {
      for (const file of list.slice(0, room)) {
        if (accept === 'image' && !file.type.startsWith('image/')) {
          toast('Only pictures can go here.', 'error')
          continue
        }
        setProgress(0)
        uploaded.push(await uploadMedia(file, folder, setProgress))
      }
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Upload failed. Please try again.', 'error')
    } finally {
      setProgress(null)
      if (inputRef.current) inputRef.current.value = ''
    }

    if (uploaded.length === 0) return
    if (single) {
      const old = value[0]
      onChange([uploaded[0]])
      void deleteMedia(old?.path)
    } else {
      onChange([...value, ...uploaded])
    }
  }

  const remove = (item: MediaItem) => {
    onChange(value.filter((m) => m.id !== item.id))
    void deleteMedia(item.path)
  }

  const makeCover = (item: MediaItem) => {
    onChange([item, ...value.filter((m) => m.id !== item.id)])
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length) void handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className={`grid gap-3 ${single ? 'grid-cols-1 sm:max-w-56' : 'grid-cols-3 sm:grid-cols-4'}`}>
          {value.map((m, i) => (
            <div key={m.id} className="group relative overflow-hidden rounded-xl border border-ink-100 bg-ink-50">
              <MediaFrame media={m} alt="" className="aspect-square w-full" />
              {!single && i === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-ink-900/85 px-2 py-0.5 text-[10px] font-semibold text-white">
                  Cover
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-0.5 bg-gradient-to-t from-ink-950/70 to-transparent p-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                {!single && i > 0 && (
                  <button
                    type="button"
                    onClick={() => makeCover(m)}
                    title="Use as cover"
                    aria-label="Use as cover"
                    className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/20 hover:text-white"
                  >
                    <Star size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(m)}
                  title="Remove"
                  aria-label="Remove"
                  className="rounded-lg p-1.5 text-white/80 transition hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${
          dragging ? 'border-sand-400 bg-sand-50' : 'border-ink-100 bg-ink-50/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          multiple={!single}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        {progress === null ? (
          <>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-ink-800 shadow-sm ring-1 ring-ink-100 transition hover:ring-sand-400"
            >
              {value.length > 0 && single ? <ImagePlus size={15} /> : <Upload size={15} />}
              {single ? (value.length > 0 ? 'Replace' : 'Choose file') : 'Add pictures or videos'}
            </button>
            <p className="mt-2 text-xs text-ink-400">
              {hint ?? `Drag and drop here · up to ${MAX_UPLOAD_MB}MB each`}
            </p>
          </>
        ) : (
          <div className="mx-auto max-w-xs">
            <div className="h-2 overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full bg-ink-900 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-ink-400">Uploading… {progress}%</p>
          </div>
        )}
      </div>
    </div>
  )
}
