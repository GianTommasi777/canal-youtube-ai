"use client";

import { FormEvent, useState } from "react";

import { apiUrl } from "@/lib/api";
import {
  AssetStatus,
  AssetType,
  SceneAsset,
  assetStatuses,
  assetTypes,
} from "@/lib/types";

const inputClass =
  "mt-1.5 w-full rounded-md border border-line bg-panel px-2.5 py-2 text-xs normal-case tracking-normal text-white outline-none focus:border-cyan/50";
const acceptedMedia = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/mp4",
].join(",");

export function SceneAssets({
  promptId,
  initialAssets,
  onMessage,
}: {
  promptId: number;
  initialAssets: SceneAsset[];
  onMessage: (message: string) => void;
}) {
  const [assets, setAssets] = useState(initialAssets);
  const [uploading, setUploading] = useState(false);

  async function uploadAsset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      onMessage("Selecciona un archivo para subir.");
      return;
    }
    setUploading(true);
    try {
      const response = await fetch(
        `${apiUrl}/visual-prompts/${promptId}/assets/upload`,
        { method: "POST", body: form },
      );
      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as {
          detail?: string;
        } | null;
        throw new Error(error?.detail);
      }
      const asset = (await response.json()) as SceneAsset;
      setAssets((current) => [...current, asset]);
      formElement.reset();
      onMessage("Archivo subido y asociado a la escena.");
    } catch (error) {
      onMessage(
        error instanceof Error && error.message
          ? error.message
          : "No se pudo subir el archivo.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function addManualAsset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const response = await fetch(`${apiUrl}/visual-prompts/${promptId}/assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          asset_type: form.get("asset_type"),
          file_path: form.get("file_path"),
          source: form.get("source") || null,
          status: "planned",
        }),
      });
      if (!response.ok) throw new Error();
      const asset = (await response.json()) as SceneAsset;
      setAssets((current) => [...current, asset]);
      formElement.reset();
      onMessage("Ruta asociada a la escena.");
    } catch {
      onMessage("No se pudo asociar la ruta.");
    }
  }

  function updateAsset(asset: SceneAsset) {
    setAssets((current) =>
      current.map((item) => (item.id === asset.id ? asset : item)),
    );
    onMessage("Asset actualizado.");
  }

  function removeAsset(assetId: number) {
    setAssets((current) => current.filter((item) => item.id !== assetId));
    onMessage("Asset eliminado.");
  }

  return (
    <div className="mt-4 border-t border-line pt-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan">
          Assets de escena
        </p>
        <span className="text-[10px] text-slate-600">{assets.length} archivos</span>
      </div>

      <form
        onSubmit={uploadAsset}
        className="mt-3 rounded-md border border-dashed border-cyan/30 bg-cyan/[0.03] p-3"
      >
        <div className="grid gap-2 md:grid-cols-2">
          <label className="text-[10px] uppercase tracking-wider text-slate-500 md:col-span-2">
            Archivo local
            <input
              type="file"
              name="file"
              accept={acceptedMedia}
              required
              className={`${inputClass} file:mr-3 file:rounded file:border-0 file:bg-cyan/10 file:px-2 file:py-1 file:text-[10px] file:text-cyan`}
            />
          </label>
          <AssetField label="Nombre opcional" name="name" placeholder="Usa el nombre del archivo" />
          <AssetField label="Origen" name="source" placeholder="manual, flux, runway..." />
        </div>
        <p className="mt-2 text-[10px] text-slate-600">
          Imágenes, audio o vídeo. Límite de API: 100 MB por defecto.
        </p>
        <button
          disabled={uploading}
          className="mt-3 w-full rounded-md border border-cyan/30 px-3 py-2 text-[10px] uppercase tracking-wider text-cyan disabled:opacity-50"
        >
          {uploading ? "Subiendo..." : "+ Subir archivo"}
        </button>
      </form>

      <details className="mt-3 rounded-md border border-line px-3 py-2">
        <summary className="cursor-pointer text-[10px] uppercase tracking-wider text-slate-500">
          Registrar una ruta existente
        </summary>
        <form onSubmit={addManualAsset} className="mt-3 grid gap-2 md:grid-cols-2">
          <AssetField label="Nombre" name="name" placeholder="Plano general" required />
          <label className="text-[10px] uppercase tracking-wider text-slate-600">
            Tipo
            <select name="asset_type" className={inputClass}>
              {assetTypes.map((type) => (
                <option value={type} key={type}>{type}</option>
              ))}
            </select>
          </label>
          <AssetField
            label="Ruta local"
            name="file_path"
            placeholder="content/assets/escena-01.png"
            required
          />
          <AssetField label="Origen" name="source" placeholder="manual, flux, runway..." />
          <button className="rounded-md border border-line px-3 py-2 text-[10px] uppercase tracking-wider text-slate-400 md:col-span-2">
            + Asociar ruta
          </button>
        </form>
      </details>

      <div className="mt-3 space-y-2">
        {assets.map((asset) => (
          <AssetEditor
            key={asset.id}
            asset={asset}
            onUpdate={updateAsset}
            onRemove={removeAsset}
            onError={(message) => onMessage(message ?? "No se pudo modificar el asset.")}
          />
        ))}
      </div>
    </div>
  );
}

function AssetEditor({
  asset,
  onUpdate,
  onRemove,
  onError,
}: {
  asset: SceneAsset;
  onUpdate: (asset: SceneAsset) => void;
  onRemove: (assetId: number) => void;
  onError: (message?: string) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const payload: Record<string, FormDataEntryValue | null> = {
        name: form.get("name"),
        asset_type: form.get("asset_type") as AssetType,
        source: form.get("source") || null,
        status: form.get("status") as AssetStatus,
      };
      if (!asset.is_uploaded) payload.file_path = form.get("file_path");
      const response = await fetch(`${apiUrl}/assets/${asset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error();
      onUpdate((await response.json()) as SceneAsset);
    } catch {
      onError();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("¿Eliminar este asset de la escena?")) return;
    setBusy(true);
    try {
      const response = await fetch(`${apiUrl}/assets/${asset.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      onRemove(asset.id);
    } catch {
      onError();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="rounded-md border border-line bg-panel p-3">
      <AssetPreview asset={asset} />
      <div className="grid gap-2 md:grid-cols-2">
        <AssetField label="Nombre" name="name" defaultValue={asset.name} required />
        <label className="text-[10px] uppercase tracking-wider text-slate-600">
          Estado
          <select name="status" defaultValue={asset.status} className={inputClass}>
            {assetStatuses.map((status) => (
              <option value={status} key={status}>{status}</option>
            ))}
          </select>
        </label>
        {asset.is_uploaded ? (
          <div className="text-[10px] uppercase tracking-wider text-slate-600">
            Archivo gestionado
            <p className={`${inputClass} truncate text-slate-400`} title={asset.file_path}>
              {asset.original_filename ?? asset.file_path}
            </p>
          </div>
        ) : (
          <AssetField label="Ruta" name="file_path" defaultValue={asset.file_path} required />
        )}
        <AssetField label="Origen" name="source" defaultValue={asset.source ?? ""} />
      </div>
      <input type="hidden" name="asset_type" value={asset.asset_type} />
      <div className="mt-3 flex items-center justify-between">
        <span className="rounded-full bg-white/5 px-2 py-1 font-mono text-[9px] uppercase text-slate-500">
          {asset.asset_type}
          {asset.file_size_bytes ? ` · ${formatBytes(asset.file_size_bytes)}` : ""}
        </span>
        <div className="flex gap-3">
          <button type="button" onClick={remove} disabled={busy} className="text-[10px] text-red-300/70">
            Eliminar
          </button>
          <button disabled={busy} className="text-[10px] uppercase tracking-wider text-cyan">
            {busy ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </form>
  );
}

function AssetPreview({ asset }: { asset: SceneAsset }) {
  if (!asset.media_url || !asset.mime_type) return null;
  const mediaOrigin = apiUrl.replace(/\/api\/?$/, "");
  const source = new URL(asset.media_url, `${mediaOrigin}/`).toString();
  const commonClass = "mb-3 max-h-64 w-full rounded-md border border-line bg-black/30 object-contain";

  if (asset.asset_type === "image") {
    // The source is a user upload served by the local API, not a Next.js optimized asset.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={source} alt={asset.name} className={commonClass} />;
  }
  if (asset.asset_type === "video") {
    return <video src={source} controls preload="metadata" className={commonClass} />;
  }
  if (asset.asset_type === "audio") {
    return <audio src={source} controls preload="metadata" className="mb-3 w-full" />;
  }
  return null;
}

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function AssetField({
  label,
  name,
  defaultValue = "",
  placeholder = "",
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="text-[10px] uppercase tracking-wider text-slate-600">
      {label}
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />
    </label>
  );
}
