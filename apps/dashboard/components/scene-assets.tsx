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

  async function addAsset(event: FormEvent<HTMLFormElement>) {
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
      onMessage("Asset añadido a la escena.");
    } catch {
      onMessage("No se pudo añadir el asset.");
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

      <form onSubmit={addAsset} className="mt-3 grid gap-2 md:grid-cols-2">
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
        <button className="rounded-md border border-cyan/30 px-3 py-2 text-[10px] uppercase tracking-wider text-cyan md:col-span-2">
          + Asociar asset
        </button>
      </form>

      <div className="mt-3 space-y-2">
        {assets.map((asset) => (
          <AssetEditor
            key={asset.id}
            asset={asset}
            onUpdate={updateAsset}
            onRemove={removeAsset}
            onError={() => onMessage("No se pudo modificar el asset.")}
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
  onError: () => void;
}) {
  const [busy, setBusy] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const response = await fetch(`${apiUrl}/assets/${asset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          asset_type: form.get("asset_type") as AssetType,
          file_path: form.get("file_path"),
          source: form.get("source") || null,
          status: form.get("status") as AssetStatus,
        }),
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
        <AssetField label="Ruta" name="file_path" defaultValue={asset.file_path} required />
        <AssetField label="Origen" name="source" defaultValue={asset.source ?? ""} />
      </div>
      <input type="hidden" name="asset_type" value={asset.asset_type} />
      <div className="mt-3 flex items-center justify-between">
        <span className="rounded-full bg-white/5 px-2 py-1 font-mono text-[9px] uppercase text-slate-500">
          {asset.asset_type}
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
