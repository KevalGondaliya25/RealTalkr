"use client";

import { useEffect, useState, useMemo, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import {
  ChevronsUpDown,
  Search,
  Plus,
  X,
  Check,
  Pencil,
  Trash2
} from "lucide-react";
import {
  useGetModelsQuery,
  useUpdateModelMutation
} from "@/redux/query/model";
import { ModelPayload, Provider, Model } from "@/types/models";
import IconImg from "@/components/component/IconImg";
import { prettifyPayload } from "@/utils/pretifyModel";
import Loading from "@/components/component/Loading";

const PAGE_SIZE = 5;
const TAB_KEYS = ["model", "transcriber", "voice"] as const;
type TabKey = typeof TAB_KEYS[number];
const TAB_LABELS: Record<TabKey, string> = {
  model: "Model",
  transcriber: "Transcriber",
  voice: "Voice Model"
};

type NewModelForm = {
  name: string;
  id: string;
  description: string;
  voices: string[];
  languages: string[];
};

export default function Page() {
  const { data, isLoading, isFetching } = useGetModelsQuery();
  const [updateModel, { isLoading: isSaving }] = useUpdateModelMutation();

  // Core state
  const [original, setOriginal] = useState<ModelPayload>({
    model: [],
    transcriber: [],
    voice: []
  });
  const [tabData, setTabData] = useState<ModelPayload>({
    model: [],
    transcriber: [],
    voice: []
  });

  const [activeTab, setActiveTab] = useState<TabKey>("model");
  const [selectedProviderIdx, setSelectedProviderIdx] = useState<number | null>(
    null
  );
  const [edited, setEdited] = useState<Record<TabKey, boolean>>({
    model: false,
    transcriber: false,
    voice: false
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingModelKey, setEditingModelKey] = useState<string | null>(null);
  const [draftModel, setDraftModel] = useState<Partial<Model>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newModelForm, setNewModelForm] = useState<NewModelForm>({
    name: "",
    id: "",
    description: "",
    voices: [],
    languages: []
  });

  // Confirm-delete modal state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Model | null>(null);

  // Open confirm modal
  const openDeleteConfirm = (model: Model) => {
    setDeleteTarget(model);
    setDeleteConfirmOpen(true);
  };

  // Perform soft delete after confirm
  const confirmSoftDelete = () => {
    if (selectedProviderIdx === null || !deleteTarget) return;
    setTabData((prev) => {
      const providers = [...prev[activeTab]];
      const provider = { ...providers[selectedProviderIdx] };
      provider.models = provider.models.map((m) =>
        m.id === deleteTarget.id ? { ...m, deleted: true } : m
      );
      providers[selectedProviderIdx] = provider;
      return { ...prev, [activeTab]: providers };
    });
    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
    markEdited();
  };

  const cancelSoftDelete = () => {
    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
  };

  // Update: remove window.confirm from soft delete
  const handleDeleteModel = (modelId: string) => {
    if (selectedProviderIdx === null) return;
    setTabData((prev) => {
      const providers = [...prev[activeTab]];
      const provider = { ...providers[selectedProviderIdx] };
      provider.models = provider.models.map((m) =>
        m.id === modelId ? { ...m, deleted: true } : m
      );
      providers[selectedProviderIdx] = provider;
      return { ...prev, [activeTab]: providers };
    });
    markEdited();
  };

  // Populate master data when API returns (only once per fetch)
  useEffect(() => {
    if (data) {
      const cleaned = prettifyPayload(data);
      setOriginal(cleaned);
      setTabData(cleaned);
      console.log("[models] loaded payload: Clennnn:", cleaned);
    }
  }, [data]);

  // Update provider selection & reset per-tab state
  useEffect(() => {
    const providers = tabData[activeTab];
    setSelectedProviderIdx(providers.length > 0 ? 0 : null);
    setSearch("");
    setPage(1);
    setEditingModelKey(null);
  }, [activeTab, tabData]);

  const isVoiceTab = activeTab === "voice";
  const isTranscriberTab = activeTab === "transcriber";

  // TagInput (kept inside component; internal local state is fine)
  const TagInput = ({
    value,
    onChange,
    placeholder
  }: {
    value: string[];
    onChange: (v: string[]) => void;
    placeholder: string;
  }) => {
    const [draft, setDraft] = useState("");
    const commitDraft = () => {
      if (!draft.trim()) return;
      const parts = draft
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
      if (parts.length === 0) return;
      onChange(Array.from(new Set([...value, ...parts])));
      setDraft("");
    };
    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {value.map((t) => (
            <span
              key={t}
              className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs flex items-center gap-1"
            >
              {t}
              <button
                type="button"
                className="text-orange-600 hover:text-orange-800"
                onClick={() => onChange(value.filter((v) => v !== t))}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          className="border rounded px-2 py-1 text-sm"
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commitDraft();
            }
          }}
          onBlur={commitDraft}
        />
        <p className="text-xs text-gray-500">
          Type value then press Enter or comma to add. Click tag (×) to remove.
        </p>
      </div>
    );
  };

  const currentProvider: Provider | null =
    selectedProviderIdx !== null
      ? tabData[activeTab][selectedProviderIdx]
      : null;

  const filteredModels: Model[] = useMemo(() => {
    if (!currentProvider) return [];
    if (!search.trim()) return currentProvider.models;
    const s = search.toLowerCase();
    return currentProvider.models.filter(
      (m) =>
        m.name.toLowerCase().includes(s) || m.id.toLowerCase().includes(s)
    );
  }, [currentProvider, search]);

  const totalPages = Math.ceil(filteredModels.length / PAGE_SIZE) || 1;
  const pagedModels = filteredModels.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const markEdited = () =>
    setEdited((p) => ({ ...p, [activeTab]: true }));

  const selectProvider = (idx: number) => {
    setSelectedProviderIdx(idx);
    setSearch("");
    setPage(1);
    setEditingModelKey(null);
  };

  const handleAddModel = () => {
    if (selectedProviderIdx === null) return;
    setNewModelForm({
      name: "",
      id: "",
      description: "",
      voices: [],
      languages: []
    });
    setShowAddModal(true);
  };

  const handleRestoreModel = (modelId: string) => {
    if (selectedProviderIdx === null) return;
    setTabData((prev) => {
      const providers = [...prev[activeTab]];
      const provider = { ...providers[selectedProviderIdx] };
      provider.models = provider.models.map((m) =>
        m.id === modelId ? { ...m, deleted: false } : m
      );
      providers[selectedProviderIdx] = provider;
      return { ...prev, [activeTab]: providers };
    });
    markEdited();
  };

  const startEdit = (model: Model, modelIdx: number) => {
    setEditingModelKey(`${selectedProviderIdx}:${modelIdx}`);
    setDraftModel({ ...model });
  };

  const cancelEdit = () => {
    setEditingModelKey(null);
    setDraftModel({});
  };

  const saveEdit = () => {
    if (editingModelKey === null || selectedProviderIdx === null) return;
    const [, modelIdxStr] = editingModelKey.split(":");
    const modelIdx = Number(modelIdxStr);
    setTabData((prev) => {
      const providers = [...prev[activeTab]];
      const provider = { ...providers[selectedProviderIdx] };
      provider.models = provider.models.map((m, idx) =>
        idx === modelIdx
          ? {
            ...m,
            name: draftModel.name ?? m.name,
            id: draftModel.id ?? m.id,
            description: draftModel.description ?? m.description
          }
          : m
      );
      providers[selectedProviderIdx] = provider;
      return { ...prev, [activeTab]: providers };
    });
    setEditingModelKey(null);
    setDraftModel({});
    markEdited();
  };

  const discardChanges = () => {
    setTabData((prev) => ({
      ...prev,
      [activeTab]: original[activeTab]
    }));
    setEdited((p) => ({ ...p, [activeTab]: false }));
    setEditingModelKey(null);
    setDraftModel({});
    setSearch("");
    setPage(1);
  };

  const handleSaveChanges = async () => {
    const response = await updateModel({
      [activeTab]: tabData[activeTab]
    });
    console.log("Save response:", response);
    setOriginal((prev) => ({
      ...prev,
      [activeTab]: tabData[activeTab]
    }));
    setEdited((p) => ({ ...p, [activeTab]: false }));
  };

  const confirmAddNewModel = () => {
    if (selectedProviderIdx === null) return;
    if (!newModelForm.name.trim() || !newModelForm.id.trim()) return;

    setTabData((prev) => {
      const providers = [...prev[activeTab]];
      const provider = { ...providers[selectedProviderIdx] };

      const newModel: Model = {
        name: newModelForm.name.trim(),
        id: newModelForm.id.trim(),
        description: newModelForm.description.trim(),
        providerId: provider.id,
        deleted: false
      };
      provider.models = [...provider.models, newModel];

      if (isVoiceTab && newModelForm.voices.length > 0) {
        const existing = provider.voices || [];
        provider.voices = Array.from(
          new Set([...existing, ...newModelForm.voices])
        );
      }
      if (isTranscriberTab && newModelForm.languages.length > 0) {
        const existingLangs = provider.languages || [];
        const mergedCodes = Array.from(
          new Set([
            ...existingLangs.map((l) => l.code),
            ...newModelForm.languages
          ])
        );
        provider.languages = mergedCodes.map((code) => {
          const found = existingLangs.find((l) => l.code === code);
          return found || { name: code, code };
        });
      }

      providers[selectedProviderIdx] = provider;
      return { ...prev, [activeTab]: providers };
    });

    markEdited();
    setShowAddModal(false);

    // Jump to last page of new list
    setTimeout(() => {
      setPage(() => {
        const pv = currentProvider ? currentProvider.models.length + 1 : 1;
        return Math.ceil(pv / PAGE_SIZE);
      });
    }, 0);
  };

  const initialLoading = isLoading || (!data && isFetching);



  return (
    <div className="p-8">
      {initialLoading ? (
        <div className="h-full w-full bg-white flex justify-center items-center absolute top-0 z-20">
          <Loading />
        </div>
      ) : (
        <>
          <h1 className=" mb-6">
            {TAB_LABELS[activeTab]}s List
          </h1>

          {/* Search */}
          <div className="flex items-center rounded-md px-3 bg-white h-10 w-full shadow-sm border border-gray-200 mb-4">
            <Search className="h-4 w-4 mr-2" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={`Search ${TAB_LABELS[activeTab]} models`}
              className="border-none bg-transparent shadow-none h-8 p-0 focus-visible:ring-0"
              disabled={!currentProvider}
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-6">
            {TAB_KEYS.map((key) => (
              <button
                key={key}
                className={`px-4 py-2 font-medium focus:outline-none ${activeTab === key
                  ? "border-b-4 border-theme text-theme"
                  : "text-gray-500 hover:text-theme"
                  }`}
                onClick={() => setActiveTab(key)}
                type="button"
              >
                {TAB_LABELS[key]}s
              </button>
            ))}
          </div>

          {/* Provider selector + actions */}
          <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
            <div className="w-full md:w-1/3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="default"
                    className="w-full justify-between !h-[40px] !px-4 !py-0 !rounded-md border !border-gray-100 shadow-sm"
                    disabled={tabData[activeTab].length === 0}
                  >
                    {selectedProviderIdx !== null &&
                      tabData[activeTab][selectedProviderIdx] ? (
                      <span>
                        <IconImg
                          name={tabData[activeTab][selectedProviderIdx].icon!}
                          className="inline-block h-4 w-4 mr-2"
                          alt={`${tabData[activeTab][selectedProviderIdx].name} Provided by RealTalkr`}
                        />
                        {tabData[activeTab][selectedProviderIdx].name}
                      </span>
                    ) : (
                      "Select Provider"
                    )}
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-56">
                  <ul>
                    {tabData[activeTab].map((p, idx) => (
                      <li
                        key={p.id || idx}
                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-theme-10 ${selectedProviderIdx === idx
                          ? "bg-theme-10 font-medium"
                          : ""
                          }`}
                        onClick={() => selectProvider(idx)}
                      >
                        <span className="text-sm">
                          <IconImg
                            name={p.icon!}
                            className="inline-block h-4 w-4 mr-2"
                            alt={`${p.name} Provided by RealTalkr`}
                          />
                          {p.name}
                        </span>
                      </li>
                    ))}
                    {tabData[activeTab].length === 0 && (
                      <li className="px-3 py-2 text-sm text-gray-500">
                        No providers
                      </li>
                    )}
                  </ul>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="primary1"
                className="!h-[40px] !px-4 !py-0 !rounded-md !flex items-center justify-center !gap-2"
                onClick={handleAddModel}
                disabled={!currentProvider}
              >
                <Plus className="h-4 w-4 mr-1" />
                <span>Add {TAB_LABELS[activeTab]}</span>
              </Button>
            </div>
          </div>

          {/* Models table */}
          <div className="border rounded-md bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-200 text-center hover:bg-gray-200">
                  <TableHead className="w-1/5">Name</TableHead>
                  <TableHead className="w-1/5">Provider ID</TableHead>
                  <TableHead className="w-2/5">Description</TableHead>
                  <TableHead className="w-1/5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedModels.map((m, idx) => {
                  const providerModelIdx = currentProvider
                    ? currentProvider.models.findIndex((mm) => mm.id === m.id)
                    : -1;
                  const rowKey = `${selectedProviderIdx}:${providerModelIdx}`;
                  const isEditing = editingModelKey === rowKey;
                  const isDeleted = !!m.deleted;

                  return (
                    <TableRow
                      key={m.id || rowKey}
                      className={isDeleted ? "opacity-60" : ""}
                    >
                      {/* Name */}
                      <TableCell className="align-center !px-2 !py-0">
                        {isEditing ? (
                          <Input
                            value={draftModel.name ?? ""}
                            onChange={(e) =>
                              setDraftModel((d) => ({ ...d, name: e.target.value }))
                            }
                            className="h-8"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={isDeleted ? "line-through" : ""}>
                              {m.name}
                            </span>
                            {isDeleted && (
                              <span className="text-[10px] uppercase tracking-wide bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                                Deleted
                              </span>
                            )}
                          </div>
                        )}
                      </TableCell>

                      {/* Provider ID */}
                      <TableCell className="align-center !px-2 !py-0">
                        {isEditing ? (
                          <Input
                            value={draftModel.id ?? ""}
                            onChange={(e) =>
                              setDraftModel((d) => ({ ...d, id: e.target.value }))
                            }
                            className="h-8"
                          />
                        ) : (
                          <span className={`font-mono ${isDeleted ? "line-through" : ""}`}>
                            {m.id}
                          </span>
                        )}
                      </TableCell>

                      {/* Description */}
                      <TableCell className="align-center !px-2 !py-0">
                        {isEditing ? (
                          <Input
                            value={draftModel.description ?? ""}
                            onChange={(e) =>
                              setDraftModel((d) => ({
                                ...d,
                                description: e.target.value
                              }))
                            }
                            className="h-8"
                          />
                        ) : (
                          m.description || "-"
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right space-x-2 !px-2 !py-2">
                        {isEditing ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline2"
                              onClick={saveEdit}
                              className="!h-8 !px-2 rounded-md"
                              title="Save"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline2"
                              onClick={cancelEdit}
                              className="!h-8 !px-2 rounded-md"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline2"
                              className="!h-8 !px-2 rounded-md"
                              onClick={() =>
                                startEdit(m, providerModelIdx >= 0 ? providerModelIdx : 0)
                              }
                              disabled={!currentProvider}
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            {isDeleted ? (
                              <Button
                                size="sm"
                                variant="outline2"
                                className="!h-8 !px-2 rounded-md text-green-600"
                                onClick={() => handleRestoreModel(m.id)}
                                disabled={!currentProvider}
                                title="Restore"
                              >
                                Restore
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline2"
                                className="!h-8 !px-2 rounded-md text-red-600"
                                onClick={() => openDeleteConfirm(m)}
                                disabled={!currentProvider}
                                title="Mark as deleted"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {pagedModels.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      {currentProvider ? "No models found." : "Select a provider to view models."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* Confirm delete modal */}
          {deleteConfirmOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-md shadow-lg w-full max-w-md p-6 flex flex-col gap-4">
                <h3 className="text-lg font-semibold">Confirm delete</h3>
                <p className="text-sm text-gray-700">
                  Are you sure you want to delete “<span className="font-medium">{deleteTarget?.name}</span>”?
                  This will mark the model as deleted and can be restored later.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button" onClick={cancelSoftDelete} className="!h-[40px] px-4 py-0 rounded-md">
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white !h-[40px] px-4 py-0 rounded-md"
                    onClick={() => {
                      if (deleteTarget) handleDeleteModel(deleteTarget.id);
                      cancelSoftDelete();
                    }}
                  >
                    Mark as deleted
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* Pagination */}
          {filteredModels.length > PAGE_SIZE && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="!h-[40px] px-4 !py-0 !rounded-md"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  className="!h-[40px] px-4 !py-0 !rounded-md"
                  size="sm"
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mt-8">
            <Button
              variant="primary"
              className="!h-[40px] px-4 !py-2 !rounded-md !text-sm"
              onClick={handleSaveChanges}
              disabled={!edited[activeTab] || isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              className="!h-[40px] px-4 !py-2 !rounded-md !text-sm"
              onClick={discardChanges}
              disabled={!edited[activeTab]}
            >
              Discard Changes
            </Button>
          </div>

          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-md shadow-lg w-full max-w-lg p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    Add New {TAB_LABELS[activeTab]}
                  </h2>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setShowAddModal(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      value={newModelForm.name}
                      onChange={(e) =>
                        setNewModelForm((f) => ({
                          ...f,
                          name: e.target.value
                        }))
                      }
                      placeholder="Model name"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">ID *</label>
                    <Input
                      value={newModelForm.id}
                      onChange={(e) =>
                        setNewModelForm((f) => ({
                          ...f,
                          id: e.target.value
                        }))
                      }
                      placeholder="Unique identifier"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      className="border rounded px-3 py-2 text-sm resize-none h-20"
                      value={newModelForm.description}
                      onChange={(e) =>
                        setNewModelForm((f) => ({
                          ...f,
                          description: e.target.value
                        }))
                      }
                      placeholder="Optional description"
                    />
                  </div>

                  {isVoiceTab && (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">
                        Voices (tag cloud)
                      </label>
                      <TagInput
                        value={newModelForm.voices}
                        onChange={(v) =>
                          setNewModelForm((f) => ({
                            ...f,
                            voices: v
                          }))
                        }
                        placeholder="Type a voice id then Enter or comma"
                      />
                    </div>
                  )}

                  {isTranscriberTab && (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">
                        Languages (codes)
                      </label>
                      <TagInput
                        value={newModelForm.languages}
                        onChange={(v) =>
                          setNewModelForm((f) => ({
                            ...f,
                            languages: v
                          }))
                        }
                        placeholder="Type a language code then Enter or comma"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    disabled={
                      !newModelForm.name.trim() ||
                      !newModelForm.id.trim()
                    }
                    onClick={confirmAddNewModel}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}