import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from './firebase'
import type { MediaItem } from '../types'

export const MAX_UPLOAD_MB = 50

function randomId() {
  return Math.random().toString(36).slice(2, 10)
}

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-60)
}

export function mediaKindOf(file: File): MediaItem['kind'] {
  return file.type.startsWith('video/') ? 'video' : 'image'
}

/** Uploads to `folder` and reports 0-100 progress. Resolves to a MediaItem
 *  that carries the storage path so the file can be deleted later. */
export async function uploadMedia(
  file: File,
  folder: string,
  onProgress?: (percent: number) => void,
): Promise<MediaItem> {
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
    throw new Error(`File is larger than ${MAX_UPLOAD_MB}MB.`)
  }
  const id = randomId()
  const path = `${folder}/${Date.now()}-${id}-${safeName(file.name)}`
  const task = uploadBytesResumable(ref(storage, path), file, { contentType: file.type })

  await new Promise<void>((resolve, reject) => {
    task.on(
      'state_changed',
      (snap) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      () => resolve(),
    )
  })

  return { id, kind: mediaKindOf(file), url: await getDownloadURL(task.snapshot.ref), path }
}

/** Best effort — a missing file should never block deleting the record. */
export async function deleteMedia(path: string | undefined) {
  if (!path) return
  try {
    await deleteObject(ref(storage, path))
  } catch {
    /* already gone */
  }
}
